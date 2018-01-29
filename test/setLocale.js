/* eslint-disable no-template-curly-in-string */
import setLocale from '../src/setLocale';

describe('Custom locale', () => {
  it('should get default locale', () => {
    const locale = require('../src/locale').default; // eslint-disable-line global-require
    expect(locale.string.email).to.equal('${path} must be a valid email');
  });

  it('should set a new locale', () => {
    const locale = require('../src/locale').default; // eslint-disable-line global-require
    const dict = {
      string: {
        email: 'Invalid email',
      },
    };

    setLocale(dict);

    expect(locale.string.email).to.equal(dict.string.email);
  });

  it('should update the main locale', () => {
    const locale = require('../src/locale').default; // eslint-disable-line global-require
    expect(locale.string.email).to.equal('Invalid email');
  });
});
