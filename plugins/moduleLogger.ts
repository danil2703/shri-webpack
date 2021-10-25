import { Compiler } from 'webpack';
import fg from 'fast-glob';
import fs from 'fs';

class ModuleLogger {
    apply(compiler: Compiler) {
        const unusedFiles: Array<string> = [];

        compiler.hooks.afterEmit.tap('ModuleLogger', async compilation => {
            const dependenciSet = new Set();

            Array.from(compilation.fileDependencies).forEach(path => {
                dependenciSet.add(path);
            });

            const entries = await fg(`${compiler.context}/src/**/*`, { ignore: ['/src/index.html'] });

            entries.forEach(file => {
                if (!dependenciSet.has(file)) {
                    unusedFiles.push(file);
                }
            });

            fs.writeFileSync('unused', JSON.stringify(unusedFiles));
        });
    }
}

export default ModuleLogger;
