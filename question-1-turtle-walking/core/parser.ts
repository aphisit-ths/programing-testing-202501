import * as fs from "node:fs";

export class MatrixParser {
    public static parseFile(filePath: string): [number[][], any] {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const lines = fileContent.trim().split('\n');

            // Parse the matrix from the first line
            const matrixData = JSON.parse(lines[0].trim());

            // Parse additional parameters if provided
            let params = null;
            if (lines.length > 1) {
                params = JSON.parse(lines[1].trim());
            }

            return [matrixData, params];
        } catch (error) {
            if (error instanceof Error) {
                if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                    console.error(`Error: File '${filePath}' not found.`);
                } else if (error instanceof SyntaxError) {
                    console.error(`Error: Invalid JSON format in file '${filePath}'.`);
                } else {
                    console.error(`Error: ${error.message}`);
                }
            } else {
                console.error('An unknown error occurred');
            }
            return [[], null];
        }
    }
}