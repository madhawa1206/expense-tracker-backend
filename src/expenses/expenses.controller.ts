import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    sub: string;
  };
}

@ApiTags('expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Add a new expense' })
  @ApiBody({ type: CreateExpenseDto })
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req: AuthRequest,
  ) {
    const userId = req.user.sub;
    if (!userId) {
      throw new BadRequestException('User ID is not available');
    }
    return this.expensesService.create(createExpenseDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all expenses for the user' })
  findAll(@Request() req: AuthRequest) {
    const userId = req.user.sub;
    if (!userId) {
      throw new BadRequestException('User ID is not available');
    }
    return this.expensesService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by id' })
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    const userId = req.user.sub;
    if (!userId) {
      throw new BadRequestException('User ID is not available');
    }
    return this.expensesService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update an expense by id' })
  update(
    @Param('id') id: string,
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req: AuthRequest,
  ) {
    const userId = req.user.sub;
    if (!userId) {
      throw new BadRequestException('User ID is not available');
    }
    return this.expensesService.update(id, userId, createExpenseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense by id' })
  delete(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.expensesService.delete(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/filter/:dateFrom/:dateTo')
  @ApiOperation({ summary: 'Filter expenses by date range' })
  async findByDate(
    @Request() req: AuthRequest,
    @Param('dateFrom') dateFrom: string,
    @Param('dateTo') dateTo: string,
  ) {
    const userId = req.user.sub;

    if (!userId) {
      console.error('User ID is not available');
      throw new BadRequestException('User ID is not available');
    }

    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (start > end) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.expensesService.findByDate(userId, start, end);
  }
}
