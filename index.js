import { main } from './lighthouse/example.js';

// Execute the main function
main().catch(error => {
    console.error('Error in main execution:', error);
    process.exit(1);
}); 