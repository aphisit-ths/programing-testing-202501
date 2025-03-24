import {Elysia, t} from 'elysia';
import {html} from '@elysiajs/html';
import {ShortenerBusinessFlow} from "./module/shorten.flow";
import {LRUCacheRepository} from "./module/repository/cache.repo";
import {SQLiteRepository} from "./module/repository/SQLiteRepository";
import {db} from "./db/db";
import {homePage} from "./html-stuff/homepage";
import {errorPage, notFoundPage} from "./html-stuff/error-page";

const CONFIG = {
    baseUrl: process.env.BASE_URL || 'http://localhost:80',
    port: parseInt(process.env.PORT || '80')
};

const cache = new LRUCacheRepository();
const SQLiteStorage = new SQLiteRepository(db);
const shortenerBusinessFlow = new ShortenerBusinessFlow(SQLiteStorage, cache);

const app = new Elysia()
    .use(html())
    .get('/', () => homePage())
    .post('/shorten', async ({body,set}) => {
        // @ts-ignore
        const {url, options} = body;
        try {
            const result = await shortenerBusinessFlow.createLookUpData(url, options);
            const shortUrl = `${CONFIG.baseUrl}/${result.id}`;

            return {
                originalUrl: url,
                shortUrl,
                shortCode: result.id,
                expiresAt: result.expiresAt
            };
        } catch (error) {
            set.status = 400
            return {
                error: error.message || 'Failed to shorten URL'
            };
        }
    }, {
        body: t.Object({
            url: t.String(),
            options: t.Optional(t.Object({
                expiryDays: t.Optional(t.Number()),
                customId: t.Optional(t.String()),
                validateUrl: t.Optional(t.Boolean())
            }))
        })
    })

    .get('/:id', async ({params}) => {
        const {id} = params;
        try {
            const result = await shortenerBusinessFlow.getRealUrl(id);

            if (!result) {
                return new Response(notFoundPage, {
                    status: 404,
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            }

            return new Response(null, {
                status: 302,
                headers: {
                    'Location': result.originalUrl
                }
            });
        } catch (error) {
            return new Response(errorPage(error.message || 'Server error occurred'), {
                status: 500,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }
    })
    .delete('/:id', async ({params,set}) => {
        const {id} = params;
        try {
            const success = await shortenerBusinessFlow.deactivateUrl(id);
            if (!success) {
                set.status = 404;
                return {
                    status: 404,
                    message: `URL with ID ${id} not found`
                };
            }
            return {
                status: 200,
                message: `URL with ID ${id} deactivated successfully`
            };
        } catch (error) {
            set.status = 500;
            return {
                status: 500,
                error: error.message || 'Failed to deactivate URL'
            };
        }
    })
    .post('/:id/reactivate', async ({params, set}) => {
        const {id} = params;
        try {
            const success = await shortenerBusinessFlow.reactivateUrl(id);
            if (!success) {
                set.status = 404;
                return {
                    status: 404,
                    message: `URL with ID ${id} not found or could not be reactivated`
                };
            }
            return {
                status: 200,
                message: `URL with ID ${id} reactivated successfully`
            };
        } catch (error) {
            set.status = 500;
            return {
                status: 500,
                error: error.message || 'Failed to reactivate URL'
            };
        }
    })
    .patch('/:id/extend', async ({params, body, set}) => {
        const {id} = params;
        // @ts-ignore
        const {days} = body;
        try {
            const success = await shortenerBusinessFlow.extendExpiration(id, days);
            if (!success) {
                set.status = 404;
                return {
                    status: 404,
                    message: `URL with ID ${id} not found`
                };
            }
            return {
                status: 200,
                message: `Expiration for URL with ID ${id} extended successfully`
            };
        } catch (error) {
            set.status = 500;
            return {
                status: 500,
                error: error.message || 'Failed to extend URL expiration'
            };
        }
    }, {
        body: t.Object({
            days: t.Number({
                default: 30,
                minimum: 1,
                maximum: 365
            })
        })
    })
    .get('/urls', async ({query, set}) => {
        const limit = Number(query?.limit || 100);
        const offset = Number(query?.offset || 0);
        try {
            const urls = await shortenerBusinessFlow.listUrls(limit, offset);
            return {
                status: 200,
                data: urls,
                pagination: {
                    limit,
                    offset,
                    count: urls.length
                }
            };
        } catch (error) {
            set.status = 500;
            return {
                status: 500,
                error: error.message || 'Failed to list URLs'
            };
        }
    })
    .all('*', () => {
        return new Response(notFoundPage, {
            status: 404,
            headers: {
                'Content-Type': 'text/html'
            }
        });
    })
    .onError(({code, error}) => {
        if (code === 'NOT_FOUND') {
            return new Response(notFoundPage, {
                status: 404,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }
        // @ts-ignore
        return new Response(errorPage(error.message || 'An unexpected error occurred'), {
            status: 500,
            headers: {
                'Content-Type': 'text/html'
            }
        });
    })
    .listen(CONFIG.port);


console.log(`URL Shortener running at http://localhost:${app.server?.port}`);