import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ParamsForService } from "src/common/Classess";
import PublicModules from "src/common/PublicModules";
import { Connection } from "typeorm";
import CategoriesService from "./Categories.Service";
import { 
    CreateDto,
 } from "./Categories.Dto";

@Controller('categories')
@ApiTags('CATEGORIES')
export class CategoriesController {
    libs = null as PublicModules;
    cateService = null as CategoriesService;

    constructor(private readonly conn: Connection){
        this.libs = new PublicModules();
        const params = new ParamsForService();
        params.conn = this.conn;
        params.libs = this.libs;
        this.cateService = new CategoriesService(params);
    }

    @Get('categories')
    async gets() {
        var task = null;
        task = await this.cateService.gets();
        return task;
    }

    @Get('categories/:id')
    async get(@Param('id') id: string) {
        var task = null;
        task = await this.cateService.get(id);
        return task;
    }

    @Post('categories')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async post(@Req() req: any ,@Body() body: CreateDto) {
        var task = null;
        // is Admin ?
        task = this.libs.fun_isAuthClient(req);
        if (task){
            return task;
        }

        task = await this.cateService.post(body);
        return task;
    }

    @Put('categories/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async put(@Req() req: any, @Param('id') id: string, @Body() body: CreateDto) {
        var task = null;
        // is Admin ?
        task = this.libs.fun_isAuthClient(req);
        if (task){
            return task;
        }
        task = await this.cateService.put(id, body);
        return task;;
    }

    @Delete('categories/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async delete(@Req() req: any, @Param('id') id: string) {
        var task = null;
        // is Admin ?
        task = this.libs.fun_isAuthClient(req);
        if (task){
            return task;
        }
            
        task = await this.cateService.delete(id);
        return task;
    }
}