import { NestFactory } from "@nestjs/core";
import { CommandModule, CommandService } from "nestjs-command";
import { SeedModule } from "./seed.module";

(async () => {
    const app = await NestFactory.createApplicationContext(SeedModule);
    app.select(CommandModule).get(CommandService).exec();
})();