import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBrandDto, UpdateBrandDto } from './dto'

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: createBrandDto,
    })
  }

  async findAll() {
    return this.prisma.brand.findMany({
      orderBy: {
        order: 'asc',
      },
    })
  }

  async findActive() {
    return this.prisma.brand.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
    })
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    })
  }

  async remove(id: string) {
    return this.prisma.brand.delete({
      where: { id },
    })
  }

  async reorder(brandIds: string[]) {
    const updates = brandIds.map((id, index) =>
      this.prisma.brand.update({
        where: { id },
        data: { order: index },
      })
    )

    return Promise.all(updates)
  }
}
