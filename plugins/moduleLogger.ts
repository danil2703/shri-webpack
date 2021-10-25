import { Compiler } from 'webpack';
import fg from 'fast-glob';
import fs from 'fs';
class ModuleLogger {
    usedFiles: Record<string, boolean> = {};
    unusedFiles: string[] = [];

    apply(compiler: Compiler) {
        compiler.hooks.afterEmit.tap('ModuleLogger', async compilation => {
            let context = compiler.context.replace(/\\/g, '/');

            Array.from(compilation.fileDependencies)
                .map(item => item.replace(/\\/g, '/'))
                .forEach((file: string) => {
                    this.usedFiles[file] = true;
                });

            const localFiles = (await fg([compiler.context, 'src/**/*.{ts,tsx,js}']));

            localFiles.forEach(file => {
                if (!this.usedFiles[`${context}/${file}`]) {
                    this.unusedFiles.push(file);
                }
            });

            fs.writeFileSync('unused', JSON.stringify(this.unusedFiles));
        });
    }
}

export default ModuleLogger;
