import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DayModule, DayProgress, Question } from '../types/accounting';
import {
  AccountElement,
  MASTER_CHART_OF_ACCOUNTS,
  ELEMENT_BLOCK_CONFIGS,
} from '../data/chartOfAccountsData';
import { CORE_ELEMENT_DEFINITIONS } from '../data/elementDefinitionsData';

/**
 * Downloads the Official Examination Scorecard Report directly as a PDF document.
 * Includes Time Spent Summary, Category Accuracy Breakdown, Full 50-Question Audit,
 * and current Date & Time below the Candidate Signature.
 */
export function downloadScorecardReportPDF(
  dayModule: DayModule,
  progress: DayProgress,
  studentName: string
): void {
  const safeName = studentName.trim() || 'Candidate';
  const fileName = `Arthabiz_Day${dayModule.dayNumber}_Scorecard_${safeName.replace(/\s+/g, '_')}.pdf`;

  const total = dayModule.questions.length;
  let correctCount = 0;
  const categoryStats: Record<string, { total: number; correct: number }> = {};

  const transactionRows: (string | number)[][] = [];

  dayModule.questions.forEach((q, idx) => {
    const userChoice = progress.answers[q.id];
    const isCorrect = userChoice === q.correctOptionIndex;

    if (!categoryStats[q.dayBookCategory]) {
      categoryStats[q.dayBookCategory] = { total: 0, correct: 0 };
    }
    categoryStats[q.dayBookCategory].total += 1;

    if (userChoice !== undefined) {
      if (isCorrect) {
        correctCount += 1;
        categoryStats[q.dayBookCategory].correct += 1;
      }
    }

    const userChoiceLetter =
      userChoice !== undefined ? `Option ${String.fromCharCode(65 + userChoice)}` : 'Unanswered';
    const correctLetter = `Option ${String.fromCharCode(65 + q.correctOptionIndex)}`;
    const statusText =
      userChoice === undefined ? 'SKIPPED' : isCorrect ? 'CORRECT' : 'INCORRECT';

    transactionRows.push([
      idx + 1,
      q.transactionCode,
      q.transactionTitle,
      userChoiceLetter,
      correctLetter,
      statusText,
    ]);
  });

  const percentage = Math.round((correctCount / total) * 100);
  let grade = 'F';
  let gradeRemark = 'Needs Substantial Revision';
  if (percentage >= 90) {
    grade = 'A+';
    gradeRemark = 'Outstanding Professional Mastery';
  } else if (percentage >= 80) {
    grade = 'A';
    gradeRemark = 'Excellent Accounting Proficiency';
  } else if (percentage >= 70) {
    grade = 'B+';
    gradeRemark = 'Good Practical Knowledge';
  } else if (percentage >= 60) {
    grade = 'B';
    gradeRemark = 'Competent - Review Adjustments';
  } else if (percentage >= 50) {
    grade = 'C';
    gradeRemark = 'Pass - Strengthen Core Principles';
  }

  // Format Time Spent
  const totalSeconds = progress.timeSpentSeconds || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeSpentFormatted = `${minutes} min${minutes === 1 ? '' : 's'} ${seconds} sec${seconds === 1 ? '' : 's'}`;

  // Current Date and Time for Candidate Signature
  const now = new Date();
  const currentDateTimeStr = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Initialize PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt

  // Top Institutional Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 68, 'F');

  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 68, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text('Arthabiz | Sikshyatech Hub', pageWidth / 2, 28, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text(
    `Practical Accounting Assessment — Official Scorecard (Day ${dayModule.dayNumber})`,
    pageWidth / 2,
    46,
    { align: 'center' }
  );

  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(
    `${dayModule.title} • Verified Assessment Record`,
    pageWidth / 2,
    59,
    { align: 'center' }
  );

  // Student & Overall Metrics Summary Cards
  let y = 84;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(36, y, pageWidth - 72, 72, 6, 6, 'FD');

  // Candidate Name & Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('CANDIDATE NAME:', 48, y + 16);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(safeName, 48, y + 30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('PRACTICE DATE:', 48, y + 46);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(dayModule.defaultDate, 48, y + 59);

  // Score & Performance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL SCORE:', 220, y + 16);
  doc.setFontSize(15);
  doc.setTextColor(37, 99, 235);
  doc.text(`${correctCount} / ${total}`, 220, y + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('TIME SPENT:', 220, y + 46);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(timeSpentFormatted, 220, y + 59);

  // Accuracy & Grade
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('ACCURACY:', 375, y + 16);
  doc.setFontSize(15);
  doc.setTextColor(percentage >= 60 ? 22 : 217, percentage >= 60 ? 163 : 119, percentage >= 60 ? 74 : 6);
  doc.text(`${percentage}%`, 375, y + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('FINAL GRADE:', 465, y + 16);
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(grade, 465, y + 32);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(gradeRemark, 465, y + 46);

  // Category Accuracy Breakdown Table
  y = 166;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Category Accuracy Breakdown', 36, y);

  const categoryRows = Object.entries(categoryStats).map(([cat, stats]) => {
    const catPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return [cat, stats.total, stats.correct, `${catPct}%`];
  });

  autoTable(doc, {
    startY: y + 6,
    margin: { left: 36, right: 36 },
    head: [['Accounting Category / Day Book', 'Total Questions', 'Correct Answers', 'Accuracy Rate (%)']],
    body: categoryRows,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 220 },
      1: { halign: 'center', cellWidth: 100 },
      2: { halign: 'center', cellWidth: 100 },
      3: { halign: 'center', cellWidth: 103 },
    },
  });

  // Detailed 50-Transaction Evaluation Audit Table
  const nextY = (doc as any).lastAutoTable.finalY + 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Detailed 50-Transaction Evaluation Audit', 36, nextY);

  autoTable(doc, {
    startY: nextY + 6,
    margin: { left: 36, right: 36 },
    head: [['#', 'Ref Code', 'Transaction Scenario', 'Your Choice', 'Correct Answer', 'Status']],
    body: transactionRows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 24, halign: 'center' },
      1: { cellWidth: 62, fontStyle: 'bold' },
      2: { cellWidth: 217 },
      3: { cellWidth: 72, halign: 'center' },
      4: { cellWidth: 72, halign: 'center' },
      5: { cellWidth: 76, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        if (data.cell.raw === 'CORRECT') {
          data.cell.styles.textColor = [22, 163, 74]; // emerald-600
        } else if (data.cell.raw === 'INCORRECT') {
          data.cell.styles.textColor = [220, 38, 38]; // red-600
        } else {
          data.cell.styles.textColor = [148, 163, 184]; // slate-400
        }
      }
    },
  });

  // Institutional Signatures Section
  const finalTableY = (doc as any).lastAutoTable.finalY;
  let sigY = finalTableY + 28;

  // If table ended near bottom of page, add a new page for signatures
  if (sigY > 740) {
    doc.addPage();
    sigY = 60;
  }

  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([2, 2], 0);

  // Candidate Signature Line (Left Column)
  doc.line(36, sigY + 24, 240, sigY + 24);
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Candidate Signature:', 36, sigY + 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(safeName, 136, sigY + 36);

  // Current Date and Time below Candidate Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Signed Date & Time:', 36, sigY + 49);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(currentDateTimeStr, 136, sigY + 49);

  // Evaluator Signature Line (Right Column)
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(355, sigY + 24, 559, sigY + 24);
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Evaluator / Instructor', 355, sigY + 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Arthabiz | Sikshyatech Hub', 355, sigY + 48);
  doc.text('Verified Digital Assessment Record', 355, sigY + 59);

  // Trigger real PDF download
  doc.save(fileName);
}

export type QuestionPaperMode = 'with-mcq' | 'questions-only';

/**
 * Downloads a clean, printable Question Paper document directly as a PDF for offline / manual pen-and-paper solving.
 * Supports both "questions-only" (without options, for pure journal drafting) and "with-mcq" (with 4 choices).
 */
export function downloadQuestionPaper(
  dayModule: DayModule,
  studentName: string,
  mode: QuestionPaperMode = 'with-mcq'
): void {
  const safeName = studentName.trim() || 'Candidate';
  const isQuestionsOnly = mode === 'questions-only';
  const fileName = isQuestionsOnly
    ? `Arthabiz_Day${dayModule.dayNumber}_Questions_Only_${safeName.replace(/\s+/g, '_')}.pdf`
    : `Arthabiz_Day${dayModule.dayNumber}_Question_Paper_MCQ_${safeName.replace(/\s+/g, '_')}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt

  // Top Institutional Header Banner (Page 1)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 68, 'F');

  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 68, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text('Arthabiz | Sikshyatech Hub', pageWidth / 2, 28, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(147, 197, 253);
  doc.text(
    `Practical Accounting Assessment — ${isQuestionsOnly ? 'Descriptive Questions Only' : 'Question Paper with MCQs'} (Day ${dayModule.dayNumber})`,
    pageWidth / 2,
    46,
    { align: 'center' }
  );

  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `${dayModule.title} • ${isQuestionsOnly ? 'Pen-and-Paper Journal Drafting Worksheet' : 'Offline Manual MCQ Practice Paper'}`,
    pageWidth / 2,
    59,
    { align: 'center' }
  );

  // Metadata Card
  let y = 82;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(36, y, pageWidth - 72, 46, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CANDIDATE NAME:', 48, y + 16);
  doc.text('PRACTICE DATE:', 240, y + 16);
  doc.text('TOTAL QUESTIONS / MARKS:', 395, y + 16);

  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(safeName, 48, y + 33);
  doc.text(dayModule.defaultDate, 240, y + 33);
  doc.text('50 Questions (50 Marks)', 395, y + 33);

  // Instructions Card
  y = 136;
  doc.setFillColor(254, 252, 232); // yellow-50
  doc.setDrawColor(254, 240, 138); // yellow-200
  doc.roundedRect(36, y, pageWidth - 72, 30, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(161, 98, 7); // yellow-800
  const instructionsText = isQuestionsOnly
    ? 'INSTRUCTIONS: Read each business transaction and draft the full double-entry journal entry with proper debit ledger, credit ledger, amount, and brief narration in the workspace provided below.'
    : 'INSTRUCTIONS: Identify the correct double-entry journal entry for each transaction. Fill your option [A, B, C, or D] in the answer box. Use the rough work space for drafting journal entries.';
  const wrappedInstructions = doc.splitTextToSize(instructionsText, pageWidth - 90);
  doc.text(wrappedInstructions, 46, y + 13);

  // Build Questions Table
  const questionRows: (string | number)[][] = dayModule.questions.map((q, idx) => {
    let textContent = '';

    if (isQuestionsOnly) {
      // Questions Only: Clean transaction scenario + formal blank journal drafting workspace
      textContent =
        `[${q.transactionCode}] ${q.transactionTitle}\n` +
        `${q.transactionText}\n\n` +
        `Draft Double-Entry Journal Solution:\n` +
        `Dr.  ______________________________________________________ (Rs. _________________)\n` +
        `Cr.  To __________________________________________________ (Rs. _________________)\n` +
        `     (Being ______________________________________________________________________)\n` +
        `_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _`;
    } else {
      // Questions with MCQs: Shows all 4 options, candidate answer bubble box, and rough work
      textContent =
        `[${q.transactionCode}] ${q.transactionTitle}\n` +
        `${q.transactionText}\n\n` +
        `[  ] ${q.options[0]}\n` +
        `[  ] ${q.options[1]}\n` +
        `[  ] ${q.options[2]}\n` +
        `[  ] ${q.options[3]}\n\n` +
        `Candidate Answer:  [      ]\n` +
        `Rough Work / Journal Entry Draft:\n` +
        `_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _`;
    }

    return [
      `Q${idx + 1}`,
      textContent,
      `[1 Mark]`,
    ];
  });

  autoTable(doc, {
    startY: 174,
    margin: { left: 36, right: 36, top: 40, bottom: 40 },
    head: [[
      'Q#',
      isQuestionsOnly
        ? 'Transaction Statement & Journal Entry Solution Workspace'
        : 'Transaction Details & Standard Accounting Options',
      'Marks',
    ]],
    body: questionRows,
    theme: 'grid',
    headStyles: {
      fillColor: isQuestionsOnly ? [15, 23, 42] : [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 9.5,
      cellPadding: 8,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 34, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 432 },
      2: { cellWidth: 57, halign: 'center', fontStyle: 'bold', textColor: [100, 116, 139] },
    },
    didDrawPage: (data) => {
      // Running Footer on every page
      const pageNum = data.pageNumber;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Arthabiz | Sikshyatech Hub • Day ${dayModule.dayNumber} ${isQuestionsOnly ? 'Questions Only' : 'MCQ Paper'} • Page ${pageNum}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: 'center' }
      );
    },
  });

  // Directly trigger real PDF download
  doc.save(fileName);
}

/**
 * Convenience helper to download Questions Only (No Options).
 */
export function downloadQuestionsOnlyPaper(dayModule: DayModule, studentName: string): void {
  downloadQuestionPaper(dayModule, studentName, 'questions-only');
}

/**
 * Convenience helper to download Questions with MCQs.
 */
export function downloadQuestionPaperWithMCQ(dayModule: DayModule, studentName: string): void {
  downloadQuestionPaper(dayModule, studentName, 'with-mcq');
}

// Export alias for consistency
export const downloadQuestionPaperPDF = downloadQuestionPaper;

/**
 * Downloads a single official Accounting Voucher directly as a high-quality PDF document.
 */
export function downloadVoucherPDF(
  question: Question,
  dayNumber: number,
  studentName?: string
): void {
  const safeName = studentName?.trim() || 'Candidate';
  const cleanRef = question.transactionCode.replace(/^TrxJV-/, '');
  const voucherNo = `JV-2083/84-D${dayNumber}-${cleanRef}`;
  const fileName = `Arthabiz_Voucher_Day${dayNumber}_${question.transactionCode}.pdf`;

  const isBank = question.dayBookCategory === 'Bank Book' || question.journalEntry.crLedger.includes('Bank');
  const isCash = question.dayBookCategory === 'Cash Book' || question.journalEntry.crLedger.includes('Cash');

  let voucherType = 'JOURNAL VOUCHER';
  if (isBank) voucherType = 'BANK PAYMENT VOUCHER';
  else if (isCash) voucherType = 'CASH PAYMENT VOUCHER';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt

  // Top Institutional Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 64, 'F');

  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 64, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Arthabiz | Sikshyatech Hub', pageWidth / 2, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(147, 197, 253);
  doc.text('Integrated Accounting & Financial Management System', pageWidth / 2, 42, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Official Accounting Voucher • Day ${dayNumber}`, pageWidth / 2, 55, { align: 'center' });

  // Voucher Type Banner
  let y = 84;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(36, y, pageWidth - 72, 32, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(voucherType, pageWidth / 2, y + 21, { align: 'center' });

  // Metadata Card
  y = 126;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(36, y, pageWidth - 72, 44, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('VOUCHER NO:', 48, y + 16);
  doc.text('DATE:', 210, y + 16);
  doc.text('CATEGORY:', 330, y + 16);
  doc.text('FISCAL YEAR:', 450, y + 16);

  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text(voucherNo, 48, y + 32);

  doc.setTextColor(15, 23, 42);
  doc.text(question.journalEntry.date, 210, y + 32);
  doc.text(question.dayBookCategory, 330, y + 32);
  doc.text('2083/84', 450, y + 32);

  // Transaction Statement Box
  y = 180;
  doc.setFillColor(239, 246, 255); // blue-50
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.roundedRect(36, y, pageWidth - 72, 48, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 64, 175);
  doc.text('TRANSACTION STATEMENT:', 48, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const wrappedText = doc.splitTextToSize(question.transactionText, pageWidth - 100);
  doc.text(wrappedText, 48, y + 28);

  // Ledger Table rows
  const rawCr = question.journalEntry.crLedger;
  const creditLines: { title: string; amtStr: string }[] = [];

  if (rawCr.includes('&')) {
    const parts = rawCr.split('&').map((p) => p.trim());
    parts.forEach((p) => {
      const match = p.match(/(.*?)\s*\(Rs\.\s*([\d,]+)\)/);
      if (match) {
        creditLines.push({ title: `To ${match[1].trim()}`, amtStr: `Rs. ${match[2]}` });
      } else {
        creditLines.push({
          title: `To ${p}`,
          amtStr: `Rs. ${new Intl.NumberFormat('en-IN').format(question.journalEntry.creditAmount)}`,
        });
      }
    });
  } else {
    creditLines.push({
      title: `To ${rawCr}`,
      amtStr: `Rs. ${new Intl.NumberFormat('en-IN').format(question.journalEntry.creditAmount)}`,
    });
  }

  const tableBody: (string | number)[][] = [
    [
      '1',
      question.journalEntry.drLedger,
      '101',
      `Rs. ${new Intl.NumberFormat('en-IN').format(question.journalEntry.debitAmount)}`,
      '—',
    ],
  ];

  creditLines.forEach((cl, idx) => {
    tableBody.push([
      `${idx + 2}`,
      `   ${cl.title}`,
      `20${idx + 1}`,
      '—',
      cl.amtStr,
    ]);
  });

  // Balanced Total Row
  tableBody.push([
    '',
    'Voucher Balance Total:',
    '',
    `Rs. ${new Intl.NumberFormat('en-IN').format(question.journalEntry.debitAmount)}`,
    `Rs. ${new Intl.NumberFormat('en-IN').format(question.journalEntry.creditAmount)}`,
  ]);

  autoTable(doc, {
    startY: 238,
    margin: { left: 36, right: 36 },
    head: [['S.N.', 'Account Head & Particulars', 'L.F.', 'Debit (NPR)', 'Credit (NPR)']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 6,
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { cellWidth: 32, halign: 'center' },
      1: { cellWidth: 260 },
      2: { cellWidth: 40, halign: 'center' },
      3: { cellWidth: 95, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 96, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.row.index === tableBody.length - 1) {
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = 'bold';
        if (data.column.index === 1) {
          data.cell.styles.halign = 'right';
        }
      }
    },
  });

  let curY = (doc as any).lastAutoTable.finalY + 14;

  // Narration Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(36, curY, pageWidth - 72, 34, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('BRIEF NARRATION:', 46, curY + 13);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const cleanNarrationText = question.journalEntry.narration.startsWith('Being')
    ? question.journalEntry.narration
    : `Being ${question.journalEntry.narration}`;
  doc.text(`(${cleanNarrationText})`, 46, curY + 25);

  curY += 56;

  // Multi-Tier Signatures Section
  doc.setDrawColor(148, 163, 184);
  const sigColWidth = (pageWidth - 72 - 30) / 4;
  const sigPositions = [
    36,
    36 + sigColWidth + 10,
    36 + (sigColWidth + 10) * 2,
    36 + (sigColWidth + 10) * 3,
  ];

  const sigRoles = [
    { title: safeName, label: 'PREPARED BY' },
    { title: 'Internal Auditor', label: 'CHECKED BY' },
    { title: 'Finance Manager', label: 'VERIFIED BY' },
    { title: 'Chief Executive / CFO', label: 'APPROVED BY' },
  ];

  sigPositions.forEach((pos, idx) => {
    doc.line(pos, curY + 22, pos + sigColWidth, curY + 22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(sigRoles[idx].title, pos + sigColWidth / 2, curY + 34, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(sigRoles[idx].label, pos + sigColWidth / 2, curY + 44, { align: 'center' });
  });

  curY += 60;

  // Verification Seal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Digitally Verified & Balanced Voucher • Arthabiz Accounting Portal',
    pageWidth / 2,
    curY + 10,
    { align: 'center' }
  );

  // Directly trigger real PDF download
  doc.save(fileName);
}

/**
 * Downloads the Official Nepal Statutory TDS Rates Schedule as a PDF.
 * Under Inland Revenue Department (IRD) Nepal & Income Tax Act 2058 (FY 2083/84).
 */
export function downloadTdsRatesPDF(customRates?: any[]): void {
  const doc = new jsPDF('landscape', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth(); // 841.89 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 595.28 pt

  // Top Institutional Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 64, 'F');

  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(0, 64, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('GOVERNMENT OF NEPAL • MINISTRY OF FINANCE', pageWidth / 2, 24, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(253, 230, 138); // amber-200
  doc.text('INLAND REVENUE DEPARTMENT (IRD) — STATUTORY TDS RATES SCHEDULE', pageWidth / 2, 40, {
    align: 'center',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text(
    'Income Tax Act 2058 (Sec 87, 88, 88A, 89 & 95A) • Fiscal Year 2083/84 Official Withholding Rates',
    pageWidth / 2,
    54,
    { align: 'center' }
  );

  // Sub-header Info Box
  let y = 78;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(30, y, pageWidth - 60, 26, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('OFFICIAL COMPLIANCE DOCUMENT', 40, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Generated: ${now} | Arthabiz Accounting Portal`, pageWidth - 40, y + 16, {
    align: 'right',
  });

  // Table Data
  const defaultRates = [
    { section: 'Sec 88(1)(4)', nature: 'Service Fee to VAT-Registered Entity (With Valid Tax Invoice)', rate: '1.5%', code: '11131', condition: 'On taxable amount excluding 13% VAT' },
    { section: 'Sec 88(1)', nature: 'House / Land / Office Rent (Paid to Natural Person)', rate: '10%', code: '11131', condition: 'Local Government Municipality deposit' },
    { section: 'Sec 88(1)', nature: 'House / Office Rent (Paid to VAT Entity / Corporate)', rate: '10%', code: '11131', condition: 'IRD Corporate withholding tax' },
    { section: 'Sec 88(1)', nature: 'Consultancy / Service Fee to Non-VAT Individuals', rate: '15%', code: '11112 / 11131', condition: 'Unregistered natural persons' },
    { section: 'Sec 88(1)', nature: 'Natural Resource Royalty (Mines, Stone, Sand, Minerals)', rate: '15%', code: '11135', condition: 'Total gross royalty before disbursement' },
    { section: 'Sec 88(1)', nature: 'General Royalty & Intellectual Property (Software, Copyright)', rate: '15%', code: '11135', condition: 'Resident licensor' },
    { section: 'Sec 88(1)', nature: 'Private Loan Interest (Non-Banking Individuals / Entities)', rate: '15%', code: '11132', condition: 'Commercial loans from non-banks' },
    { section: 'Sec 88(1)', nature: 'Bank Deposit Interest (Resident Individuals)', rate: '5%', code: '11132', condition: 'Final withholding tax' },
    { section: 'Sec 88(1)', nature: 'Bank Deposit Interest (Resident Corporate / Entities)', rate: '15%', code: '11132', condition: 'Advance tax withholding' },
    { section: 'Sec 88(1)', nature: 'Sales Performance Bonus & Commission (Dealers / Agents)', rate: '15%', code: '11133', condition: 'Commercial sales distribution' },
    { section: 'Sec 88A', nature: 'Freight Transportation & Vehicle Hire (With VAT Bill)', rate: '2.5%', code: '11131', condition: 'VAT registered transport service' },
    { section: 'Sec 88A', nature: 'Freight Transportation without VAT Bill (Natural Person)', rate: '10%', code: '11131', condition: 'Unregistered carrier' },
    { section: 'Sec 88A', nature: 'Commodity Sales Agent Commission', rate: '5%', code: '11133', condition: 'Brokerage / commercial agents' },
    { section: 'Sec 89(1)', nature: 'Contract or Agreement Payments Exceeding Rs. 50,000', rate: '1.5%', code: '11131', condition: 'Civil / supply contracts' },
    { section: 'Sec 89(3)', nature: 'Contract Payments to Non-Resident Contractors', rate: '5%', code: '11131', condition: 'Foreign non-resident contract' },
    { section: 'Sec 88(1)', nature: 'Dividend Paid by Resident Companies (General Public)', rate: '5%', code: '11134', condition: 'Final withholding tax' },
    { section: 'Sec 88(2)', nature: 'Gain on Investment Insurance / Life Insurance Benefit', rate: '5%', code: '11139', condition: 'On net profit / return' },
    { section: 'Sec 88(2)', nature: 'Unapproved Retirement Fund Gain / Benefit Payment', rate: '5%', code: '11139', condition: 'On taxable profit component' },
    { section: 'Sec 88(1)', nature: 'Windfall Gain (Lottery, Prize, Casino, Gambling, Betting)', rate: '25%', code: '11139', condition: 'Final withholding tax' },
    { section: 'Sec 87', nature: 'Employment Income (Salary / Wages / Allowances)', rate: 'Slab Rates (0%-39%)', code: '11111', condition: 'Social Security / Income Tax Slabs' },
  ];

  const sourceData = customRates && customRates.length > 0 ? customRates : defaultRates;

  const tableRows = sourceData.map((item: any, idx: number) => {
    return [
      idx + 1,
      item.section || item.sectionNepali || 'Sec 88',
      item.nature || '',
      item.rate || '',
      item.depositCodeRaw || item.code || item.depositCode || '11131',
      item.rules || item.condition || item.taxType || 'Withholding at Source',
    ];
  });

  autoTable(doc, {
    startY: 112,
    head: [['#', 'Section (दफा)', 'Nature of Payment (भुक्तानी विवरण)', 'TDS Rate', 'IRD Code', 'Statutory Conditions / Notes']],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 4,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 24, halign: 'center' },
      1: { cellWidth: 70, fontStyle: 'bold', halign: 'center' },
      2: { cellWidth: 320 },
      3: { cellWidth: 75, fontStyle: 'bold', halign: 'center', textColor: [180, 83, 9] },
      4: { cellWidth: 65, halign: 'center' },
      5: { cellWidth: 'auto' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 30, right: 30, bottom: 40 },
    didDrawPage: () => {
      // Footer on every page
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Nepal TDS Statutory Schedule • Inland Revenue Department (IRD) Compliant • Arthabiz Accounting Portal',
        30,
        pageHeight - 18
      );
      doc.text(
        `Page ${(doc as any).internal.getNumberOfPages()}`,
        pageWidth - 30,
        pageHeight - 18,
        { align: 'right' }
      );
    },
  });

  doc.save('Nepal_TDS_Rates_Schedule_2083_84.pdf');
}

/**
 * Comprehensive sanitization helper for PDF generation:
 * Strips all Devanagari (Nepali) Unicode glyphs, cleans empty or broken brackets,
 * normalizes smart punctuation, and ensures 100% readable standard Helvetica ASCII text.
 */
function sanitizePdfText(text: string): string {
  if (!text) return '';
  return text
    // Remove Devanagari Unicode characters (U+0900 to U+097F)
    .replace(/[\u0900-\u097F]+/g, '')
    // Remove empty brackets or parentheses containing only whitespace, dashes, or slashes
    .replace(/\(\s*[-–—/]?\s*\)/g, '')
    .replace(/\(\s*\)/g, '')
    // Clean up dangling hyphens inside parentheses
    .replace(/\s*-\s*\)/g, ')')
    .replace(/\(\s*-\s*/g, '(')
    // Replace smart quotes and special typographical characters
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[•]/g, '-')
    .replace(/[↑]/g, 'Increase')
    .replace(/[↓]/g, 'Decrease')
    .replace(/[→]/g, '->')
    .replace(/[«»]/g, '"')
    // Collapse extra whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/ \)/g, ')')
    .replace(/\( /g, '(')
    .trim();
}

/**
 * Downloads an executive, publication-grade PDF study guide for any of the 5 Core Financial Elements:
 * Assets, Liabilities, Equity, Income, or Expenses.
 * Uses strict English-only sanitization (no corrupted Unicode), standard 40pt page margins,
 * increased comfortable font sizes across all sections, natural text wrapping, and crystal-clear running footers.
 */
export function downloadElementStudyGuidePDF(element: AccountElement): void {
  const doc = new jsPDF('portrait', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 40; // Standard 40pt document page margin (~14mm)
  const contentWidth = pageWidth - margin * 2; // 515.28 pt

  const elemDef = CORE_ELEMENT_DEFINITIONS[element];
  const accounts = MASTER_CHART_OF_ACCOUNTS.filter((a) => a.element === element);

  // Executive Theme Colors
  const themeColors: Record<AccountElement, { rgb: [number, number, number]; hex: string }> = {
    Assets: { rgb: [4, 120, 87], hex: '#047857' }, // Deep Emerald
    Liabilities: { rgb: [190, 18, 60], hex: '#BE123C' }, // Deep Rose
    Equity: { rgb: [109, 40, 217], hex: '#6D28D9' }, // Royal Purple
    Income: { rgb: [29, 78, 216], hex: '#1D4ED8' }, // Sapphire Blue
    Expenses: { rgb: [180, 83, 9], hex: '#B45309' }, // Warm Amber
  };
  const theme = themeColors[element] || themeColors.Assets;

  // Clean English accounting statement & rule definitions
  const primaryStatement =
    element === 'Income' || element === 'Expenses'
      ? 'Income Statement (Statement of Profit or Loss)'
      : 'Balance Sheet (Statement of Financial Position)';

  const goldenRule =
    element === 'Assets' || element === 'Expenses'
      ? 'Debit to Increase (Dr) | Credit to Decrease (Cr)'
      : 'Credit to Increase (Cr) | Debit to Decrease (Dr)';

  const equationText =
    element === 'Assets'
      ? 'Assets = Liabilities + Owner Equity'
      : element === 'Liabilities'
      ? 'Liabilities = Assets - Owner Equity'
      : element === 'Equity'
      ? 'Owner Equity = Assets - Liabilities'
      : element === 'Income'
      ? 'Revenue increases Owner Equity (Recorded on Credit)'
      : 'Expenses decrease Owner Equity (Recorded on Debit)';

  // =========================================================================
  // PAGE 1: CONCEPTUAL FOUNDATION & PEDAGOGICAL REFERENCE GUIDE
  // =========================================================================

  // Top Institutional Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('ARTHABIZ ACCOUNTING STUDY SERIES', margin, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('NAS / IFRS STATUTORY CONCEPTUAL FRAMEWORK', pageWidth - margin, 22, { align: 'right' });

  // Element Banner (Increased title and subtitle font sizes)
  doc.setFillColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
  doc.rect(0, 40, pageWidth, 44, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(`CORE FINANCIAL ELEMENT: ${element.toUpperCase()} STUDY GUIDE`, margin, 61);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(240, 253, 250);
  doc.text('Authoritative Conceptual Framework, Recognition Criteria, Sub-Elements & Master Ledger Schedule', margin, 74);

  // Key Accounting Profile Card (Executive 2-Column Summary with larger font)
  let y = 94;
  const cardH = 58;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, cardH, 3, 3, 'FD');

  const midX = margin + contentWidth / 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(midX, y + 6, midX, y + cardH - 6);

  // Col 1 (Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('NORMAL BALANCE & GOLDEN RULE', margin + 12, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${elemDef.normalBalance} (${elemDef.normalBalance === 'Debit' ? 'Dr.' : 'Cr.'})`, margin + 12, y + 31);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(goldenRule, margin + 12, y + 46);

  // Col 2 (Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PRIMARY STATEMENT & EQUATION IMPACT', midX + 12, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(primaryStatement, midX + 12, y + 31);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(equationText, midX + 12, y + 46);

  y += cardH + 16;

  // Space check helper to prevent overflow past standard page margin
  const checkSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 48) {
      doc.addPage();
      // Running header on additional concept pages
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setFillColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
      doc.rect(0, 30, pageWidth, 2.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`CORE FINANCIAL ELEMENT: ${element.toUpperCase()} STUDY GUIDE (CONTINUED)`, margin, 20);
      y = 48;
    }
  };

  const renderSectionTitle = (title: string) => {
    checkSpace(28);
    doc.setFillColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
    doc.rect(margin, y, 3.5, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 10, y + 10);
    y += 18;
  };

  // 1. NAS / IFRS Conceptual Framework Statutory Definition (Increased to 10pt)
  renderSectionTitle('1. NAS / IFRS Conceptual Framework Statutory Definition');
  const cleanDef = sanitizePdfText(elemDef.nasIfrsDefinition);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  const defLines = doc.splitTextToSize(cleanDef, contentWidth - 28);
  const defBoxHeight = defLines.length * 14 + 18;

  checkSpace(defBoxHeight + 10);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, defBoxHeight, 2, 2, 'FD');

  doc.setFillColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
  doc.rect(margin, y, 3, defBoxHeight, 'F');

  doc.setTextColor(30, 41, 59);
  doc.text(defLines, margin + 14, y + 15, { lineHeightFactor: 1.4 });

  y += defBoxHeight + 16;

  // 2. Practical Everyday Business Meaning (Increased to 9.5pt)
  renderSectionTitle('2. Practical Everyday Business Meaning');
  const cleanPlain = sanitizePdfText(elemDef.plainMeaning);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const plainLines = doc.splitTextToSize(cleanPlain, contentWidth);

  checkSpace(plainLines.length * 13.5 + 10);
  doc.text(plainLines, margin, y, { lineHeightFactor: 1.4 });
  y += plainLines.length * 13.5 + 16;

  // 3. The 3 Essential Recognition Criteria (Titles 10pt, Desc 9pt)
  renderSectionTitle(`3. The 3 Essential Recognition Criteria to Qualify as ${element}`);
  elemDef.recognitionCriteria.forEach((crit) => {
    const cleanTitle = sanitizePdfText(crit.title);
    const cleanDesc = sanitizePdfText(crit.description);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(cleanDesc, contentWidth - 22);
    const itemHeight = 14 + descLines.length * 12.5 + 6;

    checkSpace(itemHeight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`[Test ${crit.number}]  ${cleanTitle}`, margin + 6, y);
    y += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(descLines, margin + 16, y, { lineHeightFactor: 1.35 });
    y += descLines.length * 12.5 + 7;
  });

  y += 8;

  // 4. Sub-Elements Pedagogical Analysis (Titles 10pt, Why 9pt, Ledgers 8.5pt)
  renderSectionTitle('4. Sub-Elements Classification & Accounting Rationale');
  elemDef.subElementsDiscussion.forEach((sub) => {
    const cleanSub = sanitizePdfText(sub.subGroup);
    const cleanWhy = sanitizePdfText(sub.whyBelongs);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const whyLines = doc.splitTextToSize(`Why it qualifies: ${cleanWhy}`, contentWidth - 20);

    const cleanLedgers = sub.typicalLedgers.map((l) => sanitizePdfText(l)).join(' • ');
    doc.setFontSize(8.5);
    const ledgerLines = doc.splitTextToSize(`Typical Ledgers: ${cleanLedgers}`, contentWidth - 20);

    const blockHeight = 14 + whyLines.length * 12 + 4 + ledgerLines.length * 11 + 6;

    checkSpace(blockHeight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${cleanSub}`, margin + 6, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(whyLines, margin + 16, y, { lineHeightFactor: 1.3 });
    y += whyLines.length * 12 + 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(ledgerLines, margin + 16, y, { lineHeightFactor: 1.3 });
    y += ledgerLines.length * 11 + 7;
  });

  // Pedagogical Rule / Capital vs Revenue Note if exists (Increased to 9pt)
  if (elemDef.capitalVsRevenueDistinction) {
    const cleanRule = sanitizePdfText(elemDef.capitalVsRevenueDistinction);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const ruleLines = doc.splitTextToSize(`Pedagogical Rule: ${cleanRule}`, contentWidth - 24);
    const boxHeight = ruleLines.length * 12.5 + 16;

    checkSpace(boxHeight + 10);
    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(252, 211, 77); // amber-300
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setTextColor(146, 64, 14); // amber-800
    doc.text(ruleLines, margin + 12, y + 13, { lineHeightFactor: 1.35 });
    y += boxHeight + 12;
  }

  // =========================================================================
  // MASTER CHART OF ACCOUNTS SCHEDULE (ALWAYS STARTS ON A FRESH PAGE)
  // =========================================================================
  doc.addPage();

  // Top Page Header Banner on Ledger Schedule Page
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 44, 'F');

  doc.setFillColor(theme.rgb[0], theme.rgb[1], theme.rgb[2]);
  doc.rect(0, 44, pageWidth, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`MASTER CHART OF ACCOUNTS: ${element.toUpperCase()} LEDGER SCHEDULE`, margin, 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Complete statutory catalog of all ${accounts.length} active master account heads under ${element}`, margin, 34);

  // Table Data with clean English-only sanitized text
  const tableRows = accounts.map((acc, idx) => {
    const subCat = sanitizePdfText(acc.subCategory);
    const name = sanitizePdfText(acc.name);
    const bal = acc.normalBalance === 'Debit' ? 'Dr' : 'Cr';
    const desc = sanitizePdfText(acc.description);
    const rule = sanitizePdfText(acc.mcqKeyNote);
    const fullDesc = rule ? `${desc} [Key Rule: ${rule}]` : desc;

    return [
      idx + 1,
      subCat,
      name,
      bal,
      fullDesc,
    ];
  });

  // Standard autoTable layout with increased font sizes (8.5pt body, 9.5pt header)
  // Columns sum to exactly 515pt matching the standard 40pt margins on A4 (515.28pt content width)
  autoTable(doc, {
    startY: 58,
    head: [['#', 'Sub-Category', 'Master Account Head', 'Bal', 'Description & Key Examination Rule']],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 4.5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: theme.rgb,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5,
      cellPadding: 5.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 24, halign: 'center' },
      1: { cellWidth: 104, fontStyle: 'bold' },
      2: { cellWidth: 125, fontStyle: 'bold' },
      3: { cellWidth: 38, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 224 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin, bottom: 42, top: 52 },
  });

  // Clean running footer on all pages (drawn ONCE after all pages and table are fully finished)
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, pageHeight - 24, pageWidth - margin, pageHeight - 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Arthabiz Accounting Portal • NAS / IFRS Conceptual Framework Study Series • ${element}`,
      margin,
      pageHeight - 12
    );
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 12,
      { align: 'right' }
    );
  }

  doc.save(`Arthabiz_${element}_Core_Element_Guide.pdf`);
}
