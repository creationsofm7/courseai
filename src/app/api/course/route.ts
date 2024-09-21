import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { auth } from "../../auth";
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

interface UpdateModuleBody {
  moduleId: string;
  title?: string;
}

interface AddModuleBody {
  courseId: string;
  title: string;
}

interface AddResourceBody {
  moduleId: string;
  title: string;
  videoUrl: string;
}

interface UpdateResourceBody {
  resourceId: string;
  title?: string;
  videoUrl?: string;
}

export async function GET(request: NextApiRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = request.url || '';
  const { searchParams } = new URL(url);
  const courseId = searchParams.get('id');

  if (!courseId) {
    return NextResponse.json({ message: 'Course ID is required' }, { status: 400 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
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

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ message: 'Error fetching course' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if ('courseId' in body) {
      return handleAddModule(body as AddModuleBody, session.user.id);
    } else if ('moduleId' in body) {
      return handleAddResource(body as AddResourceBody, session.user.id);
    } else {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}

async function handleAddModule(body: AddModuleBody, userId: string): Promise<NextResponse> {
  const { courseId, title } = body;

  if (!courseId || !title) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId: userId,
    },
  });

  if (!course) {
    return NextResponse.json({ message: 'Course not found or unauthorized' }, { status: 404 });
  }

  const module = await prisma.module.create({
    data: {
      title,
      courseId,
    },
  });

  return NextResponse.json(module, { status: 201 });
}

async function handleAddResource(body: AddResourceBody, userId: string): Promise<NextResponse> {
  const { moduleId, title, videoUrl } = body;

  if (!moduleId || !title || !videoUrl) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const module = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    include: {
      course: true,
    },
  });

  if (!module || module.course.userId !== userId) {
    return NextResponse.json({ message: 'Module not found or unauthorized' }, { status: 404 });
  }

  const resource = await prisma.resource.create({
    data: {
      title,
      videoUrl,
      moduleId,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}

export async function PUT(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if ('moduleId' in body) {
      return handleUpdateModule(body as UpdateModuleBody, session.user.id);
    } else if ('resourceId' in body) {
      return handleUpdateResource(body as UpdateResourceBody, session.user.id);
    } else {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing PUT request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}

async function handleUpdateModule(body: UpdateModuleBody, userId: string): Promise<NextResponse> {
  const { moduleId, title } = body;

  if (!moduleId) {
    return NextResponse.json({ message: 'Module ID is required' }, { status: 400 });
  }

  const module = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    include: {
      course: true,
    },
  });

  if (!module || module.course.userId !== userId) {
    return NextResponse.json({ message: 'Module not found or unauthorized' }, { status: 404 });
  }

  const updatedModule = await prisma.module.update({
    where: {
      id: moduleId,
    },
    data: {
      title: title || module.title,
    },
  });

  return NextResponse.json(updatedModule, { status: 200 });
}

async function handleUpdateResource(body: UpdateResourceBody, userId: string): Promise<NextResponse> {
  const { resourceId, title, videoUrl } = body;

  if (!resourceId) {
    return NextResponse.json({ message: 'Resource ID is required' }, { status: 400 });
  }

  const resource = await prisma.resource.findUnique({
    where: {
      id: resourceId,
    },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!resource || resource.module.course.userId !== userId) {
    return NextResponse.json({ message: 'Resource not found or unauthorized' }, { status: 404 });
  }

  const updatedResource = await prisma.resource.update({
    where: {
      id: resourceId,
    },
    data: {
      title: title || resource.title,
      videoUrl: videoUrl || resource.videoUrl,
    },
  });

  return NextResponse.json(updatedResource, { status: 200 });
}