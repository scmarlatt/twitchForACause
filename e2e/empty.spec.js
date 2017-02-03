var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
//Give the URL to the actual URL where your Angular app is running
browser.get('http://127.0.0.1:9000/home');
var name = element(by.binding('event'));
expect(name.getText()).to.eventually.equal('123');