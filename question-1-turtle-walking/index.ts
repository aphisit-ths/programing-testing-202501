import {MatrixTurtleSolver} from "./core/resolver.ts";
import {MatrixParser} from "./core/parser.ts";


function main(): void {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error("Usage: ts-node solution.ts <input_file_path> [problem_number]");
        process.exit(1);
    }

    const inputFile = args[0];
    const problemNum = args.length > 1 ? args[1] : "1-1";

    const [matrixData, params] = MatrixParser.parseFile(inputFile);

    if (matrixData.length === 0) {
        process.exit(1);
    }

    const solver = new MatrixTurtleSolver(matrixData);
    let result: string;
    console.log('=======================================================')
    switch (problemNum) {
        case "1":
            console.log('Starting process problem 1.1 (Zigzag)')
            result = solver.processZigzagWalk();
            break;
        case "2":
            if (params === null) {
                console.error("Error: Starting position not provided for problem 1.2");
                process.exit(1);
            }
            console.log('Starting process problem 1.2 (Spiral)')
            console.log(`start point at (${params})`);
            result = solver.processSpiralWalk(params);
            break;
        default:
            console.error(`Error: Unknown problem number '${problemNum}'`);
            process.exit(1);
    }
    console.log('=======================================================')
    console.log('Result:')
    console.log(result);
}

// Run the main function if this script is executed directly
if (require.main === module) {
    main();
}