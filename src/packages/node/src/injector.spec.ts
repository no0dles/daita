import { InjectContext, Injector } from './injector';

describe('node/injector', () => {
  it('should create singleInstance only once', () => {
    class TestService {
      static singleInstance = true;
    }
    const injector = new Injector();
    const svc1 = injector.get(TestService);
    const svc2 = injector.get(TestService);

    expect(svc1).toBe(svc2);
  });

  it('should create transient service every time', () => {
    class TransientService {}
    const injector = new Injector();
    const svc1 = injector.get(TransientService);
    const svc2 = injector.get(TransientService);

    expect(svc1).not.toBe(svc2);
  });

  it('should pass method', () => {
    class TransientService {
      foo() {
        return 'bar';
      }
    }
    const injector = new Injector();
    const svc = injector.get(TransientService);
    expect(svc.foo()).toBe('bar');
  });

  it('should self referencing', () => {
    class TransientService {
      self: TransientService;
      constructor(ctx: InjectContext) {
        this.self = ctx.get(TransientService);
      }
    }
    const injector = new Injector();
    const svc = injector.get(TransientService);

    expect(svc).toBe(svc.self);
  });

  it('should allow loops', () => {
    class ServiceA {
      svcB: ServiceB;
      constructor(ctx: InjectContext) {
        this.svcB = ctx.get(ServiceB);
      }
    }
    class ServiceB {
      svcA: ServiceA;
      constructor(ctx: InjectContext) {
        this.svcA = ctx.get(ServiceA);
      }
    }
    const injector = new Injector();
    const svcA = injector.get(ServiceA);
    expect(svcA).toBe(svcA.svcB.svcA);
  });

  it('should getting transient service inside single instance service throws an error', () => {
    class TransientService {}
    class SingleInstanceService {
      static singleInstance = true;
      private transient: TransientService;
      constructor(ctx: InjectContext) {
        this.transient = ctx.get(TransientService);
      }
    }
    const injector = new Injector();
    try {
      injector.get(SingleInstanceService);
      throw new Error('should not be successfull');
    } catch (e: any) {
      expect(e.message).toBe('type TransientService is no single instance');
    }
  });
});
