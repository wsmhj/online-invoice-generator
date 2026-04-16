/**
 * online-invoice-generator
 * Generate professional invoices with line items, taxes, and totals
 * Live demo: https://invoicegenerator.run
 */

'use strict';

function createInvoice(options) {
  const { invoiceNumber, date, dueDate, from, to, items = [], taxRate = 0, notes = '' } = options;
  return { invoiceNumber, date, dueDate, from, to, items, taxRate, notes };
}

function addLineItem(invoice, item) {
  const { description, quantity, unitPrice } = item;
  const total = quantity * unitPrice;
  invoice.items.push({ description, quantity, unitPrice, total });
  return invoice;
}

function calculateSubtotal(invoice) {
  return invoice.items.reduce((sum, item) => sum + item.total, 0);
}

function calculateTax(invoice) {
  return calculateSubtotal(invoice) * (invoice.taxRate / 100);
}

function calculateTotal(invoice) {
  return calculateSubtotal(invoice) + calculateTax(invoice);
}

function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

function generateInvoiceSummary(invoice) {
  const subtotal = calculateSubtotal(invoice);
  const tax = calculateTax(invoice);
  const total = calculateTotal(invoice);
  return {
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.date,
    dueDate: invoice.dueDate,
    from: invoice.from,
    to: invoice.to,
    itemCount: invoice.items.length,
    subtotal,
    taxRate: invoice.taxRate,
    tax,
    total,
    formattedSubtotal: formatCurrency(subtotal),
    formattedTax: formatCurrency(tax),
    formattedTotal: formatCurrency(total)
  };
}

function isOverdue(invoice) {
  if (!invoice.dueDate) return false;
  return new Date(invoice.dueDate) < new Date();
}

module.exports = {
  createInvoice,
  addLineItem,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
  generateInvoiceSummary,
  isOverdue
};
