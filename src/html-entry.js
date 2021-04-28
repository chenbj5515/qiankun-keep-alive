
import importHTML from 'import-html-entry';

importHTML('//localhost:7700')
    .then(res => {
        console.log(res.template);

        res.execScripts().then(exports => {
            const mount = exports;
            console.log(mount, 'exports===');
            // console.log(exports, 'exports===');
        })
});