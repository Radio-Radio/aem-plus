import { Mcrypto } from '@models/crypto/mcrypto';

describe('Mcrypto', () => {
  let mcrypto: Mcrypto;

  beforeAll(() => {
    mcrypto = new Mcrypto();
  });

  it('encryptPassword', () => {
    const exp = '504a3f99961136b7effcdbcf0d0cffe7';
    const pass = '11111111';
    expect(mcrypto.encryptPassword(pass)).toEqual(exp);
  });
  it('decryptPassword', () => {
    const encryptData = '504a3f99961136b7effcdbcf0d0cffe7';
    const pass = '11111111';
    expect(mcrypto.decryptPassword(encryptData)).toEqual(pass);
  });
  it('encryptString', () => {
    const text =
      '0fe353f83cac5379e59adbab1d37e27d8f314d3f9770507048525f67adb2ca4efbafbadd459f1d242b5f4cd8a569ac9c66280f2b6340c0ca29a9833fd52f954cf91298d307c6ae43046ab556e6736fceef304fad26f8cb4868195171216f4d4422f8a3da21100327ad6d7a41140e4c7502e2ca95d6a36f8dad1cec30947bf21b1c86e83843a827d5bf04798525a14931bf1b62a3c3d8612adbe0f2e2a098aada7421bbac6c7ec2a7f1e2f0d153f52aeb9187f8e58510431230bd4f807fc74122a871a2a9ab185d0eaca4169027ebf1206a9bf1714979c991223b78f57a97985d812cba06836b0b7c84c0924006d99339d937b9060ae05f4ad86a90e2922f038e';
    const secret =
      'ffb32ff00b75f8e8a175c0a167a131e7df7ba33105e7f53c63a37fb688877ea6';
    const exp =
      '861fb63fedf77f2d7559446b5342d6d2c481a3244ecf15998d1305fe4f7d98740fcf139ff43b39442070647653c7819650e0d4adc33ad6dbec3b6c73be6d0ec7a4210ffa157d5c2b8ef77215e106a62189f574f245374224b45a8f8c8e5d8888f53353c6fee24a017e141a9575a976550540476c0d86da76f9d4a8cd9350d9ad6957ce8dbc9ed1e4cdb792e82dc7762c56b188a61625136f468ba55c98b14ac2b52ce6cfc9bcd35b57a32d3e30f554217e8b286934d1269efce83aba5124d64210ee65db863afd87f93442d26117518067f30a5eadf379cf508bba4e9a8076f3ceacc7fe93f3b9789a5efac841a55fe578c0f289152278efa770c7e432e18ef8a736f22898b675f58769e4dd362739bac08d3e060dac6679074dfcb4b0b80888a4224acb8a2e245358835db9fac4cb9b080db0c33d841a253ce82d21084ec5e22ae31b66f75a2e51970ae8d28e81f0a1b8086fd50033d6b9ba33ba70bac6eaa2dee7bf297cf3bfa696b95a210f3912844fe155f216c0800f64f5434f68dc3674aa422c01792ffb44de4b2545b82bb55d19b7aae2a6d55da6d71cc3d95c5690efba3e76b736000f47de47c50d02e3ace3a592ab85de3d3d24b3435d36cb859de0d9e74c3c7566480019862e100860adc3bce90fa14dec66127326d7fabd09429003407d759f2debe7ef6fcd49f18c699e3c7b6971d43901b854558a4a4fc561b3ada0b2bccd09582d200370a2f58eafc6';
    expect(mcrypto.encryptString(text, secret)).toEqual(exp);
  });
  it('decryptString', () => {
    const code =
      '861fb63fedf77f2d7559446b5342d6d2c481a3244ecf15998d1305fe4f7d98740fcf139ff43b39442070647653c7819650e0d4adc33ad6dbec3b6c73be6d0ec7a4210ffa157d5c2b8ef77215e106a62189f574f245374224b45a8f8c8e5d8888f53353c6fee24a017e141a9575a976550540476c0d86da76f9d4a8cd9350d9ad6957ce8dbc9ed1e4cdb792e82dc7762c56b188a61625136f468ba55c98b14ac2b52ce6cfc9bcd35b57a32d3e30f554217e8b286934d1269efce83aba5124d64210ee65db863afd87f93442d26117518067f30a5eadf379cf508bba4e9a8076f3ceacc7fe93f3b9789a5efac841a55fe578c0f289152278efa770c7e432e18ef8a736f22898b675f58769e4dd362739bac08d3e060dac6679074dfcb4b0b80888a4224acb8a2e245358835db9fac4cb9b080db0c33d841a253ce82d21084ec5e22ae31b66f75a2e51970ae8d28e81f0a1b8086fd50033d6b9ba33ba70bac6eaa2dee7bf297cf3bfa696b95a210f3912844fe155f216c0800f64f5434f68dc3674aa422c01792ffb44de4b2545b82bb55d19b7aae2a6d55da6d71cc3d95c5690efba3e76b736000f47de47c50d02e3ace3a592ab85de3d3d24b3435d36cb859de0d9e74c3c7566480019862e100860adc3bce90fa14dec66127326d7fabd09429003407d759f2debe7ef6fcd49f18c699e3c7b6971d43901b854558a4a4fc561b3ada0b2bccd09582d200370a2f58eafc6';
    const secret =
      'ffb32ff00b75f8e8a175c0a167a131e7df7ba33105e7f53c63a37fb688877ea6';
    const exp =
      '0fe353f83cac5379e59adbab1d37e27d8f314d3f9770507048525f67adb2ca4efbafbadd459f1d242b5f4cd8a569ac9c66280f2b6340c0ca29a9833fd52f954cf91298d307c6ae43046ab556e6736fceef304fad26f8cb4868195171216f4d4422f8a3da21100327ad6d7a41140e4c7502e2ca95d6a36f8dad1cec30947bf21b1c86e83843a827d5bf04798525a14931bf1b62a3c3d8612adbe0f2e2a098aada7421bbac6c7ec2a7f1e2f0d153f52aeb9187f8e58510431230bd4f807fc74122a871a2a9ab185d0eaca4169027ebf1206a9bf1714979c991223b78f57a97985d812cba06836b0b7c84c0924006d99339d937b9060ae05f4ad86a90e2922f038e';

    expect(mcrypto.decryptString(code, secret)).toEqual(exp);
  });
});
