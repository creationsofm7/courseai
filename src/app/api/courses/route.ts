import { NextResponse } from 'next/server';
import { PrismaClient, Course } from '@prisma/client';
import { auth } from '../../auth';
import { NextApiRequest } from 'next';

const prisma = new PrismaClient();

interface CreateCourseBody {
  name?: string;
  description?: string;
  modules: {
    title: string;
    resources: {
      title: string;
      videoUrl: string;
    }[];
  }[];
}



interface AddResourceBody {
  moduleId: string;
  title: string;
  videoUrl: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body: CreateCourseBody = await request.json();
  const { name, description, modules } = body;

  if (!name || !description || !modules) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const course: Course = await prisma.course.create({
      data: {
        name,
        description,
        userId: session.user.id!,
        modules: {
          create: modules.map((module) => ({
            title: module.title,
            resources: {
              create: module.resources,
            },
          })),
        },
      },
      include: {
        modules: {
          include: {
            resources: true,
          },
        },
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Error creating course' }, { status: 500 });
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const courses: Course[] = await prisma.course.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        modules: {
          include: {
            resources: true,
          },
        },
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ message: 'Error fetching courses' }, { status: 500 });
  }
}




export async function ADD_RESOURCE(request: NextApiRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body: AddResourceBody = JSON.parse(request.body as string);
  const { moduleId, title, videoUrl } = body;

  if (!moduleId || !title || !videoUrl) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        videoUrl,
        moduleId,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error adding resource:', error);
    return NextResponse.json({ message: 'Error adding resource' }, { status: 500 });
  }
}