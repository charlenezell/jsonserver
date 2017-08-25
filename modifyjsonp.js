const zlib = require('zlib');
const concatStream = require('concat-stream');
const BufferHelper = require('bufferhelper');

/**
 * Modify the response of json
 * @param res {Response} The http response
 * @param contentEncoding {String} The http header content-encoding: gzip/deflate
 * @param callback {Function} Custom modified logic
 */
module.exports = function modifyResponse(req, res, contentEncoding, callback) {
    let unzip, zip;
    // Now only deal with the gzip/deflate/undefined content-encoding.
    switch (contentEncoding) {
        case 'gzip':
            unzip = zlib.Gunzip();
            zip = zlib.Gzip();
            break;
        case 'deflate':
            unzip = zlib.Inflate();
            zip = zlib.Deflate();
            break;
    }

    // The cache response method can be called after the modification.
    let _write = res.write;
    let _end = res.end;

    if (unzip) {
        unzip.on('error', function (e) {
            console.log('Unzip error: ', e);
            _end.call(res);
        });
        handleCompressed(req, res, _write, _end, unzip, zip, callback);
    } else if (!contentEncoding) {
        handleUncompressed(req, res, _write, _end, callback);
    } else {
        console.log('Not supported content-encoding: ' + contentEncoding);
    }
};

/**
 * handle compressed
 */
function handleCompressed(req, res, _write, _end, unzip, zip, callback) {
    // The rewrite response method is replaced by unzip stream.
    res.write = data => unzip.write(data);

    res.end = () => unzip.end();

    // Concat the unzip stream.
    let concatWrite = concatStream(data => {
        let body;
        try {
            let m = data.toString().match(new RegExp(`${req.query.callback}\((.*)\)`));
            body = JSON.parse(m[1]);
        } catch (e) {
            body = data.toString();
            console.log('JSON.parse error:', e);
        }

        // Custom modified logic
        if (typeof callback === 'function') {
            body = callback(body);
        }

        let finish = _body => {
            // Converts the JSON to buffer.
            let body = new Buffer(`${req.query.callback}(${JSON.stringify(_body)})`);

            // Call the response method and recover the content-encoding.
            zip.on('data', chunk => _write.call(res, chunk));
            zip.on('end', () => _end.call(res));

            zip.write(body);
            zip.end();
        };

        if (body && body.then) {
            body.then(finish);
        } else {
            finish(body);
        }
    });

    unzip.pipe(concatWrite);
}

/**
 * handle Uncompressed
 */
function handleUncompressed(req, res, _write, _end, callback) {
    let buffer = new BufferHelper();
    // Rewrite response method and get the content.
    res.write = data => buffer.concat(data);
    res.end = () => {
        let body;
        try {
            let str = buffer.toBuffer().toString();
            body = JSON.parse(str.slice(req.query.callback.length + 1, str.length - 1));
        } catch (e) {
          console.log('JSON.parse error:', e);
        }

        // Custom modified logic
        if (typeof callback === 'function') {
          body = callback(body);
        }

        let finish = _body => {
          // Converts the JSON to buffer.
          let body = new Buffer(`${req.query.callback}(${JSON.stringify(_body)})`);

          // Call the response method
          _write.call(res, body);
          _end.call(res);
        };

        if (body && body.then) {
          body.then(finish);
        } else {
          finish(body);
        }
      };
}