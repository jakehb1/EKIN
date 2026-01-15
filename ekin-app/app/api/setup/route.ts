import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Run Prisma DB push to create tables
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      output: stdout,
      errors: stderr || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Database initialization failed',
        error: error.message,
        output: error.stdout,
        errors: error.stderr,
      },
      { status: 500 }
    );
  }
}
