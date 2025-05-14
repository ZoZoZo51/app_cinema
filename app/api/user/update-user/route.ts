// app/api/user/update-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    return NextResponse.json({ message: 'Profil update' });
  } catch (error) {
    console.error("Erreur update profil :", error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
