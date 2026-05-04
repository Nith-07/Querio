import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add some initial notices
  await prisma.notice.createMany({
    data: [
      {
        title: "Semester Examination Registration",
        content: "The registration for the upcoming End Semester Examinations is now open on the ERP portal. Last date to register without fine is 15th May.",
        department: "Controller of Examinations"
      },
      {
        title: "Hostel Fee Payment Deadline",
        content: "All hostel students are reminded to pay their mess and room fees for the next semester by 20th May.",
        department: "Hostel Management"
      },
      {
        title: "SRM Hackathon 2026",
        content: "The annual university hackathon is back! Register your teams of up to 4 members by the end of this week. Exciting prizes to be won.",
        department: "Computer Science Dept"
      }
    ]
  });

  // Add some initial FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "How do I access the Student ERP?",
        answer: "You can access the ERP at academia.srmist.edu.in using your NetID and password.",
        category: "General"
      },
      {
        question: "What is the attendance requirement?",
        answer: "A minimum of 75% attendance is mandatory to appear for the End Semester Examinations.",
        category: "Academic"
      },
      {
        question: "Where can I apply for bonafide certificates?",
        answer: "Bonafide certificates can be requested through the student portal or by submitting an application at the respective department office.",
        category: "Administration"
      }
    ]
  });

  console.log("Database seeded successfully with SRMIST data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
