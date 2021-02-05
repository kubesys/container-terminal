var webpack = require('webpack');
//var path = require('path');
var config = require('./config')
console.log(config)

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(config)
        })
    ]
};