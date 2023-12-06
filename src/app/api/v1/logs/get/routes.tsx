// src/pages/api/v1/logs/getLogs.ts
// import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { headers } from 'next/headers';
export async function GET() {
    const logs = await prisma.serverLog.findMany();

    return Response.json(logs);
}
// http://localhost:3000/api/v1/logs/get