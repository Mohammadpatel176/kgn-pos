import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getLocalImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
};

export const generateInvoice = async (formData, cart, subtotal, gst, grandTotal) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const halfGstTotal = (gst / 2).toFixed(2);
    const logoUrl = '/KGNNewLOGO.png'; 

    try {
        const logoImg = await getLocalImage(logoUrl);

        // --- 1. WATERMARK (Fainter for readability) ---
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.05 })); // 5% opacity for clear text
        doc.addImage(logoImg, 'PNG', 55, 100, 100, 100); 
        doc.restoreGraphicsState();

        // --- 2. HEADER ---
        doc.addImage(logoImg, 'PNG', 14, 10, 22, 22);
        doc.setTextColor(0, 100, 0);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("KGN MOTORS", 40, 18);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60);
        doc.text("Shop No. 12, Auto Plaza, Near Railway Crossing,", 40, 23);
        doc.text("Sarkhej Road, Juhapura, Ahmedabad - 380055", 40, 27);
        doc.text("GSTIN: 24ABCCE1234F1Z5 | State: Gujarat (24)", 40, 31);
        doc.text("Email: kgnmotors.abd@gmail.com | Mob: +91 99721 XXXXX", 40, 35);

        // --- 3. INVOICE META ---
        doc.setTextColor(0);
        doc.setFontSize(14);
        doc.text("TAX INVOICE", 150, 18);
        doc.setFontSize(9);
        const invNo = `KGN/25-26/${Math.floor(1000 + Math.random() * 9000)}`;
        doc.text(`Invoice No: ${invNo}`, 150, 24);
        doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 150, 29);

        doc.setDrawColor(0, 100, 0);
        doc.setLineWidth(0.5);
        doc.line(14, 38, 196, 38); 

        // --- 4. CUSTOMER & VEHICLE ---
        doc.setFont("helvetica", "bold");
        doc.text("BILL TO:", 14, 46);
        doc.setFont("helvetica", "normal");
        doc.text(`${formData.customerName.toUpperCase()}`, 14, 51);
        doc.text(`Phone: +91 ${formData.customerPhone}`, 14, 56);

        if (formData.isVehicle) {
            doc.setFont("helvetica", "bold");
            doc.text("VEHICLE:", 120, 46);
            doc.setFont("helvetica", "normal");
            doc.text(`No: ${formData.vehicleNumber.toUpperCase()}`, 120, 51);
            doc.text(`Driver: ${formData.driverName}`, 120, 56);
        }

        // --- 5. ITEMS TABLE (With Row Level GST) ---
        autoTable(doc, {
            startY: 65,
            head: [["SR.", "ITEM DESCRIPTION", "QTY", "RATE", "CGST(9%)", "SGST(9%)", "AMOUNT"]],
            body: cart.map((item, i) => {
                const itemTotal = item.productPrice * item.quantity;
                const itemGst = (itemTotal * 0.09).toFixed(2);
                return [
                    i + 1,
                    item.productName.toUpperCase(),
                    item.quantity,
                    item.productPrice.toFixed(2),
                    itemGst,
                    itemGst,
                    (itemTotal + parseFloat(itemGst) * 2).toFixed(2)
                ];
            }),
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 3, textColor: [0, 0, 0] }, // Pure black text for readability
            headStyles: { fillColor: [0, 100, 0], halign: 'center' },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: 55 },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right', fontStyle: 'bold' },
            }
        });

        // --- 6. SUMMARY ---
        let finalY = doc.lastAutoTable.finalY + 10;
        const rightX = 140;
        const valX = 196;

        doc.setFontSize(10);
        doc.text("Taxable Value:", rightX, finalY);
        doc.text(`${subtotal.toFixed(2)}`, valX, finalY, { align: 'right' });
        doc.text("Total CGST:", rightX, finalY + 5);
        doc.text(`${halfGstTotal}`, valX, finalY + 5, { align: 'right' });
        doc.text("Total SGST:", rightX, finalY + 10);
        doc.text(`${halfGstTotal}`, valX, finalY + 10, { align: 'right' });

        doc.setLineDash([1, 1], 0);
        doc.line(rightX, finalY + 13, 196, finalY + 13);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text("GRAND TOTAL:", rightX, finalY + 20);
        doc.text(`Rs. ${grandTotal.toFixed(2)}`, valX, finalY + 20, { align: 'right' });

        // --- 7. FOOTER ---
        const footerY = 270;
        doc.setFontSize(9);
        doc.text("For, KGN MOTORS", 150, footerY - 15);
        doc.setLineDash([1, 1], 0);
        doc.rect(148, footerY - 13, 45, 15); 
        doc.text("Authorised Signatory", 153, footerY + 6);

        window.open(doc.output('bloburl'), '_blank');
        doc.save(`KGN_INV_${Date.now()}.pdf`);

    } catch (error) {
        console.error("PDF Generation failed", error);
    }
};