import { bold, blue, yellow, green, cyan } from "colorette";

export function showHelp() {
    console.log(`
${bold(blue('Classpro CLI'))} - Command Line Interface

${yellow('Commands:')}
  ${green('init')}      Initialize a new Classpro project
  ${green('deploy')}    Build and start both frontend and backend
  ${green('config')}    Update project configuration
  ${green('help')}      Show this help message

${yellow('Usage:')}
  classpro <command>

${yellow('Example:')}
  ${cyan('classpro init')}
`);
}