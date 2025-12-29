import { bootstrapApplication } from '@angular/platform-browser';
import type { BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context?: BootstrapContext) => {
  // Forward the server BootstrapContext at runtime. The TypeScript
  // signatures for `bootstrapApplication` don't expose this third
  // argument, so suppress the checker — the argument is required
  // at runtime by the SSR engine to create the server platform.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return bootstrapApplication(AppComponent, config as any, context as any);
};

export default bootstrap;
