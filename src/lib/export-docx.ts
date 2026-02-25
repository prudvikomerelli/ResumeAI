import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

export async function generateResumeDocx(
  resumeText: string,
  candidateName?: string
): Promise<Buffer> {
  const lines = resumeText.split("\n");
  const children: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ text: "" }));
      continue;
    }

    if (trimmed.startsWith("# ")) {
      children.push(
        new Paragraph({
          text: trimmed.replace("# ", ""),
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );
    } else if (trimmed.startsWith("## ")) {
      children.push(
        new Paragraph({
          text: trimmed.replace("## ", ""),
          heading: HeadingLevel.HEADING_2,
        })
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^[-•]\s*/, ""),
              size: 22,
            }),
          ],
          bullet: { level: 0 },
        })
      );
    } else {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              size: 22,
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer as Buffer;
}

export async function generateCoverLetterDocx(
  coverLetterText: string
): Promise<Buffer> {
  const paragraphs = coverLetterText.split("\n\n");
  const children: Paragraph[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: trimmed,
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer as Buffer;
}
