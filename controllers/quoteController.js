const PDFDocument = require('pdfkit');

/**
 * Helper to format PKR currency
 */
const formatPKR = (amount) => {
  return 'PKR ' + Number(amount || 0).toLocaleString('en-PK');
};

/**
 * POST /api/admin/quotes/generate
 * Server-side PDF quotation generator using PDFKit
 * Memory footprint: ~15MB (Zero risk of OOM on Render Free Tier 512MB RAM)
 */
const generateQuotationPDF = async (req, res, next) => {
  try {
    const {
      clientName,
      companyName,
      clientPhone,
      clientEmail,
      siteAddress,
      city = 'Lahore',
      equipmentList = [],
      laborCharges = 0,
      customDiscount = 0,
      notes = 'Standard 1-Year On-Site Hardware Replacement Warranty Included.',
    } = req.body;

    if (!clientName || !clientPhone || !Array.isArray(equipmentList) || equipmentList.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Client Name, Phone, and at least one Equipment item are required to generate a quotation.',
          statusCode: 400,
        },
      });
    }

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

    // 1. Calculate Financials
    let equipmentSubtotal = 0;
    const sanitizedItems = equipmentList.map((item, index) => {
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

    // 2. Initialize PDF Document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      bufferPages: true,
      info: {
        Title: `Tooba Engineering Quotation - ${quoteNumber}`,
        Author: 'Tooba Engineering CCTV & IT Solutions',
        Subject: 'Commercial B2B CCTV & Security Proposal',
      },
    });

    // Set response headers for direct PDF download or inline view
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Tooba-Quote-${quoteNumber}.pdf"`);

    doc.pipe(res);

    // 3. Header & Company Branding
    // Primary Brand Bar
    doc.rect(40, 40, 515, 60).fill('#0f172a'); // Dark Navy slate

    doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('TOOBA ENGINEERING', 55, 52);
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#94a3b8')
      .text('17+ Years of Excellence in CCTV, Data Centers & Enterprise Security', 55, 76);

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor('#38bdf8')
      .text('COMMERCIAL QUOTATION', 420, 55, { align: 'right' });
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#e2e8f0')
      .text(`Ref: ${quoteNumber}`, 420, 68, { align: 'right' });
    doc.text(`Date: ${quoteDate}`, 420, 80, { align: 'right' });

    doc.moveDown(2.5);

    // 4. Client & Project Details Box
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

    // 5. Equipment Table Header
    const tableTop = 195;
    doc.rect(40, tableTop, 515, 22).fill('#1e293b');

    doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
    doc.text('#', 45, tableTop + 6, { width: 20 });
    doc.text('ITEM DESCRIPTION', 70, tableTop + 6, { width: 220 });
    doc.text('BRAND / MODEL', 300, tableTop + 6, { width: 75 });
    doc.text('QTY', 380, tableTop + 6, { width: 30, align: 'center' });
    doc.text('UNIT (PKR)', 415, tableTop + 6, { width: 60, align: 'right' });
    doc.text('TOTAL (PKR)', 480, tableTop + 6, { width: 65, align: 'right' });

    // 6. Equipment Rows
    let currentY = tableTop + 24;
    doc.font('Helvetica').fontSize(8);

    sanitizedItems.forEach((item, idx) => {
      // Alternate row backgrounds
      if (idx % 2 === 0) {
        doc.rect(40, currentY - 2, 515, 18).fill('#f8fafc');
      }

      doc.fillColor('#334155');
      doc.text(String(item.sr), 45, currentY, { width: 20 });
      doc.text(item.description, 70, currentY, { width: 220, ellipsis: true });
      doc.text(item.brand, 300, currentY, { width: 75, ellipsis: true });
      doc.text(String(item.qty), 380, currentY, { width: 30, align: 'center' });
      doc.text(Number(item.unitRate).toLocaleString('en-PK'), 415, currentY, { width: 60, align: 'right' });
      doc.text(Number(item.lineTotal).toLocaleString('en-PK'), 480, currentY, { width: 65, align: 'right' });

      currentY += 18;
    });

    // 7. Financial Summary Section
    currentY += 10;
    doc.rect(40, currentY, 515, 1).fill('#cbd5e1'); // Divider line
    currentY += 8;

    const summaryLeft = 330;
    doc.font('Helvetica').fontSize(8).fillColor('#475569');

    doc.text('Equipment Subtotal:', summaryLeft, currentY);
    doc.text(formatPKR(equipmentSubtotal), 440, currentY, { width: 105, align: 'right' });
    currentY += 14;

    doc.text('Installation & Cabling Charges:', summaryLeft, currentY);
    doc.text(formatPKR(parsedLabor), 440, currentY, { width: 105, align: 'right' });
    currentY += 14;

    if (parsedDiscount > 0) {
      doc.text('Special Commercial Discount:', summaryLeft, currentY);
      doc.fillColor('#16a34a').text(`- ${formatPKR(parsedDiscount)}`, 440, currentY, { width: 105, align: 'right' });
      doc.fillColor('#475569');
      currentY += 14;
    }

    // Grand Total Highlight
    doc.rect(summaryLeft - 10, currentY - 2, 235, 24).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
    doc.text('NET PAYABLE:', summaryLeft, currentY + 5);
    doc.text(formatPKR(grandTotal), 420, currentY + 5, { width: 125, align: 'right' });

    currentY += 35;

    // 8. Terms & Conditions
    doc.fillColor('#0f172a').fontSize(8).font('Helvetica-Bold').text('TERMS & CONDITIONS:', 40, currentY);
    currentY += 12;
    doc.font('Helvetica').fontSize(7).fillColor('#64748b');
    doc.text('1. 1-Year on-site hardware replacement warranty on all cameras and recording equipment (burns/water damage excluded).', 40, currentY);
    currentY += 10;
    doc.text('2. Network cabling, PVC piping, and conduits are estimated and will be billed on actual measured length upon installation.', 40, currentY);
    currentY += 10;
    doc.text('3. Cloud remote access and mobile streaming require an active internet connection provided by the client on site.', 40, currentY);
    currentY += 10;
    doc.text(`4. Special Notes: ${notes}`, 40, currentY);

    // 9. Signatures Block
    const sigY = 700;
    doc.rect(50, sigY, 160, 1).fill('#94a3b8');
    doc.rect(385, sigY, 160, 1).fill('#94a3b8');

    doc.fillColor('#334155').fontSize(8).font('Helvetica-Bold');
    doc.text('PREPARED BY (ADMIN / OPERATIONS)', 50, sigY + 5, { width: 160, align: 'center' });
    doc.font('Helvetica').fontSize(7).text('Tayyab - Operations Lead', 50, sigY + 16, { width: 160, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(8);
    doc.text('EXECUTIVE APPROVAL (CEO)', 385, sigY + 5, { width: 160, align: 'center' });
    doc.font('Helvetica').fontSize(7).text('Ashraf Sahib - CEO Tooba Engineering', 385, sigY + 16, { width: 160, align: 'center' });

    // Finalize PDF Stream
    doc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuotationPDF,
};
