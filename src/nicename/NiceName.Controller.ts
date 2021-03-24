import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Connection } from "typeorm";
import { NiceNameService } from "./NiceName.Service";
import { CreateDto } from "./NiceName.Dto";
import PublicModules from "../common/PublicModules";
import { ParamsForService } from "src/common/Classess";

@ApiTags('NICE NAME')
@Controller('nice_name')
export class NiceNameController{

    // **************** DEFAULT ***************
    nNameService = null as NiceNameService;
    libs = null as PublicModules;

    constructor(private readonly conn: Connection) {
        this.libs = new PublicModules();
        const params = new ParamsForService()
        params.conn = this.conn;
        params.libs = this.libs;
        this.nNameService = new NiceNameService(params);
    }
    // **************** DEFAULT ***************

    @Get('nice_name')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async gets(@Req() req: any): Promise<any> {
        // is admin?
        const isClient = this.libs.fun_isAuthClient(req);
        if (isClient){
            return isClient;
        }

        // all db
        const data = this.nNameService.gets();
        
        return data;
    }

    @Get('nice_name/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async get(@Req() req: any, @Param('id') id: string):Promise<any>{
        const isClient = this.libs.fun_isAuthClient(req);
        if (isClient){
            return isClient;
        }

        const res = await this.nNameService.get(id);

        return res;
    }

    @Post('nice_name')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async add(@Req() req: any, @Body() body: CreateDto):Promise<any>{
        // is Admin?
        const isClient = this.libs.fun_isAuthClient(req);
        if (isClient){
            return isClient;
        }

        // add database
        const res = await this.nNameService.add(body);
        return res;
    }

    @Put('nice_name/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async put(@Req() req: any, @Param('id') id: string, @Body() body: CreateDto): Promise<any>{
        var task = null;
        const isClient = this.libs.fun_isAuthClient(req);
        if (isClient){
            return isClient;
        }

        task = await this.nNameService.put(id, body);

        return task;
    }

    @Delete('nice_name/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async delete(@Req() req: any, @Param('id') id: string): Promise<any> {
        var task = null;
        task = this.libs.fun_isAuthClient(req);
        if (task){
            return task;
        }

        task = await this.nNameService.delete(id);

        return task;
    }
}