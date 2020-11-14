import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isSidebarPinned = false;
  isSidebarToggeled = false;

  constructor() { }

  toggleSidebar() {
    this.isSidebarToggeled = ! this.isSidebarToggeled;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = ! this.isSidebarPinned;
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled
    }
  }

  exportarExtratoPdf(data: any){
    let doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Ficha do produto", 65, 15);

    doc.rect(10, 20, 30, 8, "FD");
    doc.rect(10, 28, 30, 8, "FD");
    doc.rect(10, 36, 30, 8, "FD");
    doc.rect(40, 20, 160, 8, "F");
    doc.rect(40, 28, 160, 8, "F");
    doc.rect(40, 36, 160, 8, "F");

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(data.name, 12, 25);
    doc.text("Nome", 12, 33);
    doc.text("Preço", 12, 41);

    doc.setTextColor(255, 255, 255);
    doc.text("001", 42, 25);
    doc.text("Notebook 14' i7 8GB 1TB", 42, 33);
    doc.text("R$ 2400,00", 42, 41);

    // doc.save("a4.pdf");
    doc.output();
  }

  exportarIngressoPdf(data: any){

  }

  exportarEventosMaisVendidosPdf(data: any){

  }

}
