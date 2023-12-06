// src/pages/api/v1/logs/addLogAttemptToDB.ts

// import type { NextApiRequest, NextApiResponse } from 'next';
// import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

import { headers } from 'next/headers';

export async function POST(req: Request) {

    // req.body = JSON.parse(req.body);
    // const { user, action, success, module, message } = req.body;
    const newLog = await req.json();

    const logEntry = await prisma.serverLog.create({
        data: {
            ...newLog,
        },
    });
    return Response.json(logEntry);
}
