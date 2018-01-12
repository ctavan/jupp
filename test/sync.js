import { object, string } from '../src';

describe('Sync', () => {
  describe('validate', () => {
    it('should be valid', () => {
      const schema = object().shape({
        name: string().required(),
        email: string().email(),
      });
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      let result;
      let error;
      schema
        .validate(data, {
          sync: true,
        })
        .then(res => {
          result = res;
        })
        .catch(err => {
          error = err;
        });

      expect(result).to.deep.equal(data);
      expect(error).to.be.undefined; // eslint-disable-line no-unused-expressions
    });

    it('should throw', () => {
      const schema = object().shape({
        email: string().email(),
      });
      const data = {
        email: 'johnexample.com',
      };

      let result;
      let error;
      schema
        .validate(data, {
          sync: true,
        })
        .then(res => {
          result = res;
        })
        .catch(err => {
          error = err;
        });

      expect(result).to.be.undefined; // eslint-disable-line no-unused-expressions
      expect(error.name).to.equal('ValidationError');
      expect(error.path).to.equal('email');
    });
  });

  describe('validateSync', () => {
    it('should be valid', () => {
      const schema = object().shape({
        name: string().required(),
        email: string().email(),
      });
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = schema.validateSync(data);
      expect(result).to.deep.equal(data);
    });

    it('should throw', () => {
      const schema = object().shape({
        email: string().email(),
      });
      const data = {
        email: 'johnexample.com',
      };

      (() => {
        schema.validateSync(data);
      }).should.throw();
    });
  });

  describe('isValidSync', () => {
    it('should return true', () => {
      const schema = object().shape({
        name: string().required(),
        email: string().email(),
      });
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = schema.isValidSync(data);
      expect(result).to.equal(true);
    });

    it('should return false', () => {
      const schema = object().shape({
        email: string().email(),
      });
      const data = {
        email: 'johnexample.com',
      };

      const result = schema.isValidSync(data);
      expect(result).to.equal(false);
    });
  });
});
