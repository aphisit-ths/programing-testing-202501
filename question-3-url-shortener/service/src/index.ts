import {Elysia, t} from 'elysia';
import {html} from '@elysiajs/html';
import {ShortenerBusinessFlow} from "./module/shorten.flow";
import {LRUCacheRepository} from "./module/repository/cache.repo";
import {InMemoryRepository} from "./module/repository/in-memory-db.repo";

import {homePage} from "./html-stuff/homepage";
import {errorPage, notFoundPage} from "./html-stuff/error-page";
import {SQLiteRepository} from "./module/repository/SQLiteRepository";
import {db} from "./db/db";

const cache = new LRUCacheRepository();
// in case that want to change db
const storage = new InMemoryRepository()
const SQLiteStorage = new SQLiteRepository(db);
const shortener = new ShortenerBusinessFlow(SQLiteStorage, cache);

const app = new Elysia()
    .use(html())
    .get('/', () => homePage())
    .post('/shorten', async ({body}) => {
        const {url} = body as { url: string };
        try {
            if (!url) {
                return {error: 'URL is required'};
            }
            // URL validation is handled in ShortenerBusinessFlow
            const result = await shortener.createLookUpData(url);
            const shortUrl = `http://localhost:80/${result.id}`;

            return {
                originalUrl: url,
                shortUrl,
                shortCode: result.id
            };
        } catch (error) {
            console.error('Error shortening URL:', error);
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
            const result = await shortener.getRealUrl(id);

            if (!result) {
                return new Response(notFoundPage, {
                    status: 404,
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            }

            // ใช้ Response API แทนที่จะใช้ set.redirect
            return new Response(null, {
                status: 301,
                headers: {
                    'Location': result.originalUrl
                }
            });
        } catch (error) {
            console.error('Error redirecting URL:', error);
            return new Response(errorPage(error.message || 'Server error occured'), {
                status: 500,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }
    })

    // Catch-all route for handling 404s
    .all('*', () => {
        return new Response(notFoundPage, {
            status: 404,
            headers: {
                'Content-Type': 'text/html'
            }
        });
    })

    // Global error handler
    .onError(({code, error}) => {
        console.error(`Error [${code}]:`, error);

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

    .listen(80);

console.log(`URL Shortener running at http://localhost:${app.server?.port}`);