import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName = 'Engr. Mian Salman',
      companyName = 'Apex Textiles Mills Ltd.',
      clientPhone = '03224419988',
      clientEmail = 'salman@apextextiles.com.pk',
      siteAddress = 'Plot 42-B, Industrial Estate Sundar',
      city = 'Lahore',
      equipmentList = [],
      laborCharges = 0,
      customDiscount = 0,
      notes = 'Standard 1-Year Comprehensive On-Site Hardware Replacement Warranty Included.',
    } = body;

    const quoteNumber = `TE-QTE-${Date.now().toString().slice(-6)}`;
    const quoteDate = new Date().toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const validUntilDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let equipmentSubtotal = 0;
    const sanitizedItems = (equipmentList.length > 0
      ? equipmentList
      : [
          {
            description: '4-Camera Hikvision 5MP ColorVu Smart Package',
            brand: 'Hikvision',
            quantity: 1,
            unitRate: 54900,
          },
        ]
    ).map((item: any, index: number) => {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const unitRate = Math.max(0, parseFloat(item.unitRate) || 0);
      const lineTotal = qty * unitRate;
      equipmentSubtotal += lineTotal;
      return {
        sr: index + 1,
        description: String(item.description || 'Hardware Item').trim(),
        brand: String(item.brand || 'OEM Standard').trim(),
        qty,
        unitRate,
        lineTotal,
      };
    });

    const parsedLabor = Math.max(0, parseFloat(laborCharges) || 0);
    const parsedDiscount = Math.max(0, parseFloat(customDiscount) || 0);
    const grandTotal = Math.max(0, equipmentSubtotal + parsedLabor - parsedDiscount);

    const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    // 1. Header & Company Branding
    doc.rect(40, 40, 515, 60).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('TOOBA ENGINEERING', 55, 52);
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#94a3b8')
      .text('17+ Years of Excellence in CCTV, Data Centers & Enterprise Security', 55, 76);

    doc.fontSize(8).font('Helvetica-Bold').fillColor('#38bdf8').text('COMMERCIAL QUOTATION', 420, 55, { align: 'right' });
    doc.fontSize(8).font('Helvetica').fillColor('#e2e8f0').text(`Ref: ${quoteNumber}`, 420, 68, { align: 'right' });
    doc.text(`Date: ${quoteDate}`, 420, 80, { align: 'right' });

    // 2. Client Details Box
    const clientBoxY = 115;
    doc.rect(40, clientBoxY, 515, 65).lineWidth(1).strokeColor('#e2e8f0').stroke();
    doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold').text('QUOTED TO:', 55, clientBoxY + 10);
    doc.font('Helvetica').fillColor('#334155');
    doc.text(`Client: ${clientName} ${companyName ? `(${companyName})` : ''}`, 55, clientBoxY + 24);
    doc.text(`Contact: ${clientPhone} ${clientEmail ? `| ${clientEmail}` : ''}`, 55, clientBoxY + 36);
    doc.text(`Site: ${siteAddress}, ${city}`, 55, clientBoxY + 48);

    doc.fillColor('#0f172a').font('Helvetica-Bold').text('PROJECT DETAILS:', 340, clientBoxY + 10);
    doc.font('Helvetica').fillColor('#334155');
    doc.text(`Validity: 14 Days (Until ${validUntilDate})`, 340, clientBoxY + 24);
    doc.text('Warranty: 1-Year Comprehensive Replacement', 340, clientBoxY + 36);
    doc.text('Payment Terms: 70% Advance, 30% on Handover', 340, clientBoxY + 48);

    // 3. Equipment Table Header
    const tableTop = 195;
    doc.rect(40, tableTop, 515, 22).fill('#1e293b');
    doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
    doc.text('#', 45, tableTop + 6, { width: 20 });
    doc.text('ITEM DESCRIPTION', 70, tableTop + 6, { width: 220 });
    doc.text('BRAND / MODEL', 300, tableTop + 6, { width: 75 });
    doc.text('QTY', 380, tableTop + 6, { width: 30, align: 'center' });
    doc.text('UNIT (PKR)', 415, tableTop + 6, { width: 60, align: 'right' });
    doc.text('TOTAL (PKR)', 480, tableTop + 6, { width: 65, align: 'right' });

    let currentY = tableTop + 24;
    doc.font('Helvetica').fontSize(8);

    sanitizedItems.forEach((item: any, idx: number) => {
      if (idx % 2 === 0) doc.rect(40, currentY - 2, 515, 18).fill('#f8fafc');
      doc.fillColor('#334155');
      doc.text(String(item.sr), 45, currentY, { width: 20 });
      doc.text(item.description, 70, currentY, { width: 220, ellipsis: true });
      doc.text(item.brand, 300, currentY, { width: 75, ellipsis: true });
      doc.text(String(item.qty), 380, currentY, { width: 30, align: 'center' });
      doc.text(Number(item.unitRate).toLocaleString('en-PK'), 415, currentY, { width: 60, align: 'right' });
      doc.text(Number(item.lineTotal).toLocaleString('en-PK'), 480, currentY, { width: 65, align: 'right' });
      currentY += 18;
    });

    // 4. Financial Summary
    currentY += 10;
    doc.rect(40, currentY, 515, 1).fill('#cbd5e1');
    currentY += 8;

    const summaryLeft = 330;
    doc.font('Helvetica').fontSize(8).fillColor('#475569');
    doc.text('Equipment Subtotal:', summaryLeft, currentY);
    doc.text(`PKR ${equipmentSubtotal.toLocaleString('en-PK')}`, 440, currentY, { width: 105, align: 'right' });
    currentY += 14;

    doc.text('Installation & Cabling Charges:', summaryLeft, currentY);
    doc.text(`PKR ${parsedLabor.toLocaleString('en-PK')}`, 440, currentY, { width: 105, align: 'right' });
    currentY += 14;

    if (parsedDiscount > 0) {
      doc.text('Special Commercial Discount:', summaryLeft, currentY);
      doc.fillColor('#16a34a').text(`- PKR ${parsedDiscount.toLocaleString('en-PK')}`, 440, currentY, { width: 105, align: 'right' });
      doc.fillColor('#475569');
      currentY += 14;
    }

    doc.rect(summaryLeft - 10, currentY - 2, 235, 24).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
    doc.text('NET PAYABLE:', summaryLeft, currentY + 5);
    doc.text(`PKR ${grandTotal.toLocaleString('en-PK')}`, 420, currentY + 5, { width: 125, align: 'right' });
    currentY += 35;

    // 5. Terms
    doc.fillColor('#0f172a').fontSize(8).font('Helvetica-Bold').text('TERMS & CONDITIONS:', 40, currentY);
    currentY += 12;
    doc.font('Helvetica').fontSize(7).fillColor('#64748b');
    doc.text('1. 1-Year on-site hardware replacement warranty on all cameras and recording equipment (burns/water damage excluded).', 40, currentY);
    currentY += 10;
    doc.text('2. Network cabling, PVC piping, and conduits are estimated and will be billed on actual measured length upon installation.', 40, currentY);
    currentY += 10;
    doc.text(`3. Notes: ${notes}`, 40, currentY);

    // 6. Signatures
    const sigY = 700;
    doc.rect(50, sigY, 160, 1).fill('#94a3b8');
    doc.rect(385, sigY, 160, 1).fill('#94a3b8');
    doc.fillColor('#334155').fontSize(8).font('Helvetica-Bold');
    doc.text('OPERATIONS LEAD (ADMIN)', 50, sigY + 5, { width: 160, align: 'center' });
    doc.font('Helvetica').fontSize(7).text('Tayyab - Operations', 50, sigY + 16, { width: 160, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(8);
    doc.text('EXECUTIVE GOVERNANCE (CEO)', 385, sigY + 5, { width: 160, align: 'center' });
    doc.font('Helvetica').fontSize(7).text('Ashraf Sahib - CEO', 385, sigY + 16, { width: 160, align: 'center' });

    doc.end();

    const pdfBuffer = await pdfPromise;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Tooba-Quote-${quoteNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
