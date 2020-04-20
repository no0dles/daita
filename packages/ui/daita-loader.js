//import { getOptions } from 'loader-utils';
//import validateOptions from 'schema-utils';

const schema = {
    type: 'object',
    properties: {
        test: {
            type: 'string',
        },
    },
};

module.exports = function (source) {
    //const options = getOptions(this);

    //validateOptions(schema, options, 'Example Loader');

    // Apply some transformations to the source...
    console.log(source);
    return source + '<script>console.log("test")</script>';
    //return `export default ${ JSON.stringify(source) }`;
};