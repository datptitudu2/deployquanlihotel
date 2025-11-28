console.log("🎯 frontend/app.js ĐÃ ĐƯỢC LOAD!");

// API CONFIGURATION - API_BASE đã được khai báo trong index.html
// KHÔNG khai báo lại const/var ở đây để tránh lỗi "already declared"
// Chỉ sử dụng trực tiếp API_BASE từ global scope

// ==================== CRUD API CLASSES ====================
class CustomerAPI {
  static async getAll() {
    const response = await fetch(`${API_BASE}/customers`);
    return await response.json();
  }
  static async create(customer) {
    const response = await fetch(`${API_BASE}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
    return await response.json();
  }
  static async delete(id) {
    const response = await fetch(`${API_BASE}/customers/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  }
}

class RoomAPI {
  static async getAll() {
    const response = await fetch(`${API_BASE}/rooms`);
    return await response.json();
  }
  static async create(room) {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    });
    return await response.json();
  }
  static async delete(id) {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  }
}

class ServiceAPI {
  static async getAll() {
    const response = await fetch(`${API_BASE}/services`);
    return await response.json();
  }
}

class BookingAPI {
  static async getAll() {
    const response = await fetch(`${API_BASE}/bookings`);
    return await response.json();
  }
}

// ==================== LOAD DATA FUNCTIONS ====================
async function loadCustomers() {
  console.log("🔄 Đang tải khách hàng...");
  try {
    const response = await fetch(`${API_BASE}/customers`);
    const customers = await response.json();
    console.log("✅ Khách hàng nhận được:", customers.length, "items");
    if (customers.length > 0) {
      console.log("👤 Khách hàng đầu tiên:", customers[0]);
    }
    displayCustomers(customers);
  } catch (error) {
    console.error("❌ Lỗi tải khách hàng:", error);
    alert("Lỗi tải khách hàng: " + error.message);
  }
}

async function loadRooms() {
  console.log("🔄 Đang tải phòng...");
  try {
    const response = await fetch(`${API_BASE}/rooms`);
    const rooms = await response.json();
    console.log("✅ Phòng nhận được:", rooms.length, "items");
    if (rooms.length > 0) {
      console.log("🏠 Phòng đầu tiên:", rooms[0]);
    }
    displayRooms(rooms);
  } catch (error) {
    console.error("❌ Lỗi tải phòng:", error);
    alert("Lỗi tải phòng: " + error.message);
  }
}

async function loadServices() {
  try {
    console.log("🔄 Đang tải dịch vụ...");
    const response = await fetch(`${API_BASE}/services`);
    const services = await response.json();
    console.log("✅ Dịch vụ nhận được:", services.length, "items");
    if (services.length > 0) {
      console.log("📦 Dịch vụ đầu tiên:", services[0]);
    }
    displayServices(services);
  } catch (error) {
    console.error("❌ Lỗi tải dịch vụ:", error);
  }
}

async function loadBookings() {
  try {
    console.log("🔄 Đang tải đặt phòng...");
    const response = await fetch(`${API_BASE}/bookings`);
    const bookings = await response.json();
    console.log("✅ Đặt phòng nhận được:", bookings.length, "items");
    if (bookings.length > 0) {
      console.log("📦 Đặt phòng đầu tiên:", bookings[0]);
    }
    displayBookings(bookings);
  } catch (error) {
    console.error("❌ Lỗi tải đặt phòng:", error);
  }
}

async function loadInvoices() {
  try {
    console.log("🔄 Đang tải hóa đơn...");
    const response = await fetch(`${API_BASE}/invoices`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi tải hóa đơn');
    }
    const invoices = await response.json();
    console.log("✅ Hóa đơn nhận được:", Array.isArray(invoices) ? invoices.length : 'not array', "items");
    if (Array.isArray(invoices) && invoices.length > 0) {
      console.log("📦 Hóa đơn đầu tiên:", invoices[0]);
    }
    // Đảm bảo invoices là array
    if (Array.isArray(invoices)) {
      displayInvoices(invoices);
    } else {
      console.error('❌ Response không phải array:', invoices);
      displayInvoices([]);
    }
  } catch (error) {
    console.error("❌ Lỗi tải hóa đơn:", error);
    alert("Lỗi tải hóa đơn: " + error.message);
    displayInvoices([]);
  }
}

async function loadUsage() {
  try {
    console.log("🔄 Đang tải sử dụng dịch vụ...");
    const response = await fetch(`${API_BASE}/usage`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi tải sử dụng dịch vụ');
    }
    const usage = await response.json();
    console.log("✅ Sử dụng dịch vụ nhận được:", Array.isArray(usage) ? usage.length : 'not array', "items");
    if (Array.isArray(usage) && usage.length > 0) {
      console.log("📦 Sử dụng dịch vụ đầu tiên:", usage[0]);
    }
    // Đảm bảo usage là array
    if (Array.isArray(usage)) {
      displayUsage(usage);
    } else {
      console.error('❌ Response không phải array:', usage);
      displayUsage([]);
    }
  } catch (error) {
    console.error("❌ Lỗi tải sử dụng dịch vụ:", error);
    alert("Lỗi tải sử dụng dịch vụ: " + error.message);
    displayUsage([]);
  }
}

// ==================== DISPLAY FUNCTIONS ====================
function displayCustomers(customers) {
  console.log("🎨 Bắt đầu hiển thị khách hàng...");
  const tbody = document.querySelector("#table-customers tbody");
  if (!tbody) {
    console.error("❌ Không tìm thấy #table-customers tbody");
    return;
  }

  tbody.innerHTML = "";
  console.log("✅ Đã clear tbody khách hàng");

  customers.forEach((customer) => {
    const row = `
            <tr>
                <td class="id">${customer.MaKH}</td>
                <td><strong style="color: #0f4aa6;">${
                  customer.HoTen || "Chưa có tên"
                }</strong></td>
                <td>${customer.Email || "-"}</td>
                <td>${customer.SoDienThoai || "-"}</td>
                <td>${customer.DiaChi || "-"}</td>
                <td class="actions">
                    <button class="btn small primary" onclick="editCustomer(${customer.MaKH})" style="margin-right: 6px;">
                      <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn small danger" onclick="deleteCustomer('${
                      customer.MaKH
                    }')">
                      <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });

  console.log("✅ Đã hiển thị xong", customers.length, "khách hàng");
}

function displayRooms(rooms) {
  console.log("🎨 Bắt đầu hiển thị phòng...");
  const tbody = document.querySelector("#table-rooms tbody");
  if (!tbody) {
    console.error("❌ Không tìm thấy #table-rooms tbody");
    const table = document.querySelector("#table-rooms");
    console.error("   - Table element:", table);
    console.error("   - Page element:", document.getElementById("page-rooms"));
    return;
  }

  // Check if table is visible
  const table = document.querySelector("#table-rooms");
  const tableDisplay = window.getComputedStyle(table).display;
  const tableWrapper = table?.closest('.table-wrapper');
  const wrapperDisplay = tableWrapper ? window.getComputedStyle(tableWrapper).display : 'N/A';
  console.log("   - Table display:", tableDisplay);
  console.log("   - Table wrapper display:", wrapperDisplay);
  console.log("   - Tbody found:", !!tbody);

  tbody.innerHTML = "";
  console.log("✅ Đã clear tbody phòng");

  rooms.forEach((room) => {
    const statusColor = {
      'Trống': '#28a745',
      'Đã đặt': '#ffc107',
      'Đang sử dụng': '#dc3545',
      'Bảo trì': '#6c757d'
    };
    const status = room.TrangThai || room.TinhTrang || 'Trống';
    const color = statusColor[status] || '#6c757d';
    
    const row = `
            <tr>
                <td class="id"><strong>${room.SoPhong || room.MaPhong}</strong></td>
                <td><strong style="color: #0f4aa6;">${
                  room.LoaiPhong || "Chưa phân loại"
                }</strong></td>
                <td>${room.SoNguoiToiDa || "-"} người</td>
                <td><span style="color: ${color}; font-weight: bold;">${status}</span></td>
                <td style="color: #28a745; font-weight: bold;">${
                  room.GiaPhong && !isNaN(parseFloat(room.GiaPhong)) ? parseFloat(room.GiaPhong).toLocaleString('vi-VN') + " đ" : "-"
                }</td>
                <td class="actions">
                    <button class="btn small primary" onclick="editRoom(${room.MaPhong})" style="margin-right: 6px;">
                      <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn small danger" onclick="deleteRoom('${
                      room.MaPhong
                    }')">
                      <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });

  console.log("✅ Đã hiển thị xong", rooms.length, "phòng");
  
  // Final check: verify rows were added
  const rows = tbody.querySelectorAll('tr');
  console.log("   - Số rows trong tbody:", rows.length);
  if (rows.length === 0) {
    console.error("❌ CRITICAL: Không có rows nào được thêm vào tbody!");
  } else {
    console.log("   - Row đầu tiên:", rows[0]);
  }
  
  // Check table visibility again
  const finalTableDisplay = window.getComputedStyle(table).display;
  if (finalTableDisplay === 'none') {
    console.error("❌ CRITICAL: Table bị ẩn (display=none)!");
  }
}

function displayServices(services) {
  console.log("🎨 Bắt đầu hiển thị dịch vụ...");
  const tbody = document.querySelector("#table-services tbody");
  if (!tbody) {
    console.error("❌ Không tìm thấy #table-services tbody");
    return;
  }
  tbody.innerHTML = "";
  console.log("✅ Đã clear tbody dịch vụ");

  services.forEach((service) => {
    const row = `
            <tr>
                <td class="id">${service.MaDV}</td>
                <td><strong style="color: #0f4aa6;">${service.TenDV || "-"}</strong></td>
                <td style="color: #28a745; font-weight: bold;">${
                  service.DonGia && !isNaN(parseFloat(service.DonGia)) ? parseFloat(service.DonGia).toLocaleString('vi-VN') + " đ" : "Miễn phí"
                }</td>
                <td class="actions">
                    <button class="btn small primary" onclick="editService(${service.MaDV})" style="margin-right: 6px;">
                      <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn small danger" onclick="deleteService('${
                      service.MaDV
                    }')">
                      <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });

  console.log("✅ Đã hiển thị xong", services.length, "dịch vụ");
}

function displayBookings(bookings) {
  console.log("🎨 Bắt đầu hiển thị đặt phòng...");
  const tbody = document.querySelector("#table-bookings tbody");
  if (!tbody) {
    console.error("❌ Không tìm thấy #table-bookings tbody");
    return;
  }
  tbody.innerHTML = "";
  console.log("✅ Đã clear tbody đặt phòng");

  bookings.forEach((booking) => {
    const statusColor = {
      'Chờ xác nhận': '#ffc107',
      'Đã xác nhận': '#17a2b8',
      'Đã check-in': '#28a745',
      'Đã check-out': '#6c757d',
      'Đã hủy': '#dc3545'
    };
    const status = booking.TrangThaiText || booking.TrangThai || 'Chờ xác nhận';
    const color = statusColor[status] || '#6c757d';
    
    const row = `
            <tr>
                <td class="id"><strong>#${booking.MaDP}</strong></td>
                <td>${booking.MaKH || "-"}</td>
                <td><strong style="color: #0f4aa6;">${booking.TenKH || "-"}</strong></td>
                <td><strong>${booking.MaPhong || "-"}</strong> <small style="color: #6c757d;">(${booking.LoaiPhong || ""})</small></td>
                <td>${booking.NgayNhan ? new Date(booking.NgayNhan).toLocaleDateString('vi-VN') : "-"}</td>
                <td>${booking.NgayTra ? new Date(booking.NgayTra).toLocaleDateString('vi-VN') : "-"}</td>
                <td><span style="color: ${color}; font-weight: bold;">${status}</span></td>
                <td class="actions">
                    <button class="btn small danger" onclick="deleteBooking('${
                      booking.MaDP
                    }')">Xóa</button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });

  console.log("✅ Đã hiển thị xong", bookings.length, "đặt phòng");
}

function displayInvoices(invoices) {
  console.log("🎨 Bắt đầu hiển thị hóa đơn...");
  const tbody = document.querySelector("#table-invoices tbody");
  if (!tbody) {
    console.error("❌ Không tìm thấy #table-invoices tbody");
    return;
  }
  tbody.innerHTML = "";
  console.log("✅ Đã clear tbody hóa đơn");

  invoices.forEach((invoice) => {
    const phuongThucText = {
      'tien_mat': 'Tiền mặt',
      'chuyen_khoan': 'Chuyển khoản',
      'the': 'Thẻ'
    };
    const trangThaiText = {
      'chua_thanh_toan': 'Chưa thanh toán',
      'da_thanh_toan': 'Đã thanh toán'
    };
    const trangThaiColor = {
      'chua_thanh_toan': '#dc3545',
      'da_thanh_toan': '#28a745'
    };
    
    const row = `
      <tr>
        <td class="id">${invoice.MaHD}</td>
        <td>${invoice.NgayLap ? new Date(invoice.NgayLap).toLocaleDateString('vi-VN') : '-'}</td>
        <td style="color: #28a745; font-weight: bold;">${invoice.TongTien && !isNaN(parseFloat(invoice.TongTien)) ? parseFloat(invoice.TongTien).toLocaleString('vi-VN') + ' đ' : '0 đ'}</td>
        <td>${phuongThucText[invoice.PhuongThucTT] || invoice.PhuongThucTT}</td>
        <td><span style="color: ${trangThaiColor[invoice.TrangThai] || '#666'}; font-weight: bold;">${trangThaiText[invoice.TrangThai] || invoice.TrangThai}</span></td>
        <td class="actions" style="white-space: nowrap;">
          ${invoice.TrangThai === 'chua_thanh_toan' ? `
            <button class="btn small primary" onclick="showQRPayment(${invoice.MaHD}, ${invoice.TongTien || 0}, '${invoice.MaHD}')" style="margin-right: 6px;">
              <i class="fas fa-qrcode"></i> QR
            </button>
          ` : ''}
          <button class="btn small danger" onclick="deleteInvoice('${invoice.MaHD}')">
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  console.log("✅ Đã hiển thị xong", invoices.length, "hóa đơn");
}

function displayUsage(usage) {
  console.log("🎨 Bắt đầu hiển thị sử dụng dịch vụ...");
  const tbody = document.querySelector("#table-usage tbody");
  if (!tbody) {
    console.error("❌ Không tìm thấy #table-usage tbody");
    return;
  }
  tbody.innerHTML = "";
  console.log("✅ Đã clear tbody sử dụng dịch vụ");

  usage.forEach((item) => {
    const row = `
      <tr>
        <td class="id">${item.MaSD}</td>
        <td>#${item.MaDatPhong || '-'}</td>
        <td><strong style="color: #0f4aa6;">${item.TenDV || '-'}</strong></td>
        <td>${item.SoLuong || 1}</td>
        <td style="color: #28a745; font-weight: bold;">${item.ThanhTien && !isNaN(parseFloat(item.ThanhTien)) ? parseFloat(item.ThanhTien).toLocaleString('vi-VN') + ' đ' : '0 đ'}</td>
        <td class="actions">
          <button class="btn small danger" onclick="deleteUsage('${item.MaSD}')">
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  console.log("✅ Đã hiển thị xong", usage.length, "sử dụng dịch vụ");
}

async function deleteInvoice(invoiceId) {
  if (!confirm(`Xóa hóa đơn ${invoiceId}?`)) return;
  try {
    const response = await fetch(`${API_BASE}/invoices/${invoiceId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
      alert('Xóa hóa đơn thành công!');
      loadInvoices();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function deleteUsage(usageId) {
  if (!confirm(`Xóa sử dụng dịch vụ ${usageId}?`)) return;
  try {
    const response = await fetch(`${API_BASE}/usage/${usageId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
      alert('Xóa sử dụng dịch vụ thành công!');
      loadUsage();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// ==================== CRUD OPERATIONS ====================
// ==================== CRUD OPERATIONS ====================
function addRow(kind) {
  console.log('🔵 addRow called with kind:', kind);
    if (kind === "customers") {
    openCustomerModal();
    } else if (kind === "rooms") {
    openRoomModal();
  } else if (kind === "services") {
    openServiceModal();
  } else if (kind === "bookings") {
    openBookingModalForm();
  } else if (kind === "invoices") {
    openInvoiceModal();
  } else if (kind === "usage") {
    openUsageModal();
  } else if (kind === "users") {
    openUserModal();
  } else {
    alert("Chức năng này đang được phát triển");
  }
}

// ==================== CUSTOMER MODAL ====================
let editingCustomerId = null;

function openCustomerModal(customer = null) {
  console.log('🔵 openCustomerModal called', customer);
  editingCustomerId = customer ? customer.MaKH : null;
  const modal = document.getElementById('customerModal');
  if (!modal) {
    console.error('❌ Modal customerModal not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  const title = document.getElementById('customerModalTitle');
  
  if (customer) {
    title.textContent = 'Sửa khách hàng';
    document.getElementById('customerHoTen').value = customer.HoTen || '';
    document.getElementById('customerEmail').value = customer.Email || '';
    document.getElementById('customerPhone').value = customer.SoDienThoai || '';
    document.getElementById('customerCCCD').value = customer.CCCD || '';
    document.getElementById('customerAddress').value = customer.DiaChi || '';
  } else {
    title.textContent = 'Thêm khách hàng';
    document.getElementById('customerForm').reset();
  }
  
  modal.classList.add('active');
  console.log('✅ Modal customerModal opened');
}

async function editCustomer(customerId) {
  try {
    const response = await fetch(`${API_BASE}/customers`);
    const customers = await response.json();
    const customer = customers.find(c => c.MaKH == customerId);
    if (customer) {
      openCustomerModal(customer);
    } else {
      alert('Không tìm thấy khách hàng');
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

function closeCustomerModal() {
  document.getElementById('customerModal').classList.remove('active');
  document.getElementById('customerForm').reset();
  editingCustomerId = null;
}

async function handleCustomerSubmit(e) {
  e.preventDefault();
  
  const customerData = {
    HoTen: document.getElementById('customerHoTen').value,
    Email: document.getElementById('customerEmail').value,
    SoDienThoai: document.getElementById('customerPhone').value,
    CCCD: document.getElementById('customerCCCD').value,
    DiaChi: document.getElementById('customerAddress').value
  };
  
  try {
    let response;
    if (editingCustomerId) {
      response = await fetch(`${API_BASE}/customers/${editingCustomerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
    } else {
      response = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
    }
    
    const result = await response.json();
    if (response.ok) {
      alert(editingCustomerId ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng thành công!');
      closeCustomerModal();
      loadCustomers();
      loadDashboardStats();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// ==================== ROOM MODAL ====================
let editingRoomId = null;

async function openRoomModal(room = null) {
  console.log('🔵 openRoomModal called', room);
  editingRoomId = room ? room.MaPhong : null;
  const modal = document.getElementById('roomModal');
  if (!modal) {
    console.error('❌ Modal roomModal not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  const title = document.getElementById('roomModalTitle');
  
  if (room) {
    title.textContent = 'Sửa phòng';
    document.getElementById('roomSoPhong').value = room.SoPhong || '';
    const maLoai = room.MaLoai || (room.LoaiPhong === 'Standard' ? '1' : room.LoaiPhong === 'Deluxe' ? '2' : '3');
    document.getElementById('roomLoai').value = maLoai;
    document.getElementById('roomTinhTrang').value = room.TinhTrang || 'trong';
  } else {
    title.textContent = 'Thêm phòng';
    document.getElementById('roomForm').reset();
    document.getElementById('roomTinhTrang').value = 'trong';
  }
  
  modal.classList.add('active');
  console.log('✅ Modal roomModal opened');
}

async function editRoom(roomId) {
  try {
    const response = await fetch(`${API_BASE}/rooms`);
    const rooms = await response.json();
    const room = rooms.find(r => r.MaPhong == roomId);
    if (room) {
      openRoomModal(room);
    } else {
      alert('Không tìm thấy phòng');
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

function closeRoomModal() {
  document.getElementById('roomModal').classList.remove('active');
  document.getElementById('roomForm').reset();
  editingRoomId = null;
}

async function handleRoomSubmit(e) {
  e.preventDefault();
  
  const maLoai = parseInt(document.getElementById('roomLoai').value);
  
  const roomData = {
    SoPhong: document.getElementById('roomSoPhong').value,
    MaLoai: maLoai,
    TinhTrang: document.getElementById('roomTinhTrang').value
  };
  
  try {
    let response;
    if (editingRoomId) {
      response = await fetch(`${API_BASE}/rooms/${editingRoomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
    } else {
      response = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
    }
    
    const result = await response.json();
    if (response.ok) {
      alert(editingRoomId ? 'Cập nhật phòng thành công!' : 'Thêm phòng thành công!');
      closeRoomModal();
      loadRooms();
      loadDashboardStats();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// ==================== SERVICE MODAL ====================
let editingServiceId = null;

function openServiceModal(service = null) {
  console.log('🔵 openServiceModal called', service);
  editingServiceId = service ? service.MaDV : null;
  const modal = document.getElementById('serviceModal');
  if (!modal) {
    console.error('❌ Modal serviceModal not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  const title = document.getElementById('serviceModalTitle');
  
  if (service) {
    title.textContent = 'Sửa dịch vụ';
    document.getElementById('serviceTenDV').value = service.TenDV || '';
    document.getElementById('serviceMoTa').value = service.MoTa || '';
    document.getElementById('serviceDonGia').value = service.DonGia || '';
    document.getElementById('serviceDonViTinh').value = service.DonViTinh || '';
  } else {
    title.textContent = 'Thêm dịch vụ';
    document.getElementById('serviceForm').reset();
  }
  
  modal.classList.add('active');
  console.log('✅ Modal serviceModal opened');
}

function closeServiceModal() {
  document.getElementById('serviceModal').classList.remove('active');
  document.getElementById('serviceForm').reset();
  editingServiceId = null;
}

async function handleServiceSubmit(e) {
  e.preventDefault();
  
  const serviceData = {
    TenDV: document.getElementById('serviceTenDV').value,
    MoTa: document.getElementById('serviceMoTa').value,
    DonGia: parseFloat(document.getElementById('serviceDonGia').value),
    DonViTinh: document.getElementById('serviceDonViTinh').value
  };
  
  try {
    let response;
    if (editingServiceId) {
      response = await fetch(`${API_BASE}/services/${editingServiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
    } else {
      response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
    }
    
    const result = await response.json();
    if (response.ok) {
      alert(editingServiceId ? 'Cập nhật dịch vụ thành công!' : 'Thêm dịch vụ thành công!');
      closeServiceModal();
      loadServices();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function editService(serviceId) {
  try {
    const response = await fetch(`${API_BASE}/services`);
    const services = await response.json();
    const service = services.find(s => s.MaDV == serviceId);
    if (service) {
      openServiceModal(service);
    } else {
      alert('Không tìm thấy dịch vụ');
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// ==================== BOOKING MODAL FORM ====================
let editingBookingId = null;

async function openBookingModalForm(booking = null) {
  console.log('🔵 openBookingModalForm called', booking);
  editingBookingId = booking ? booking.MaDP : null;
  const modal = document.getElementById('bookingModalForm');
  if (!modal) {
    console.error('❌ Modal bookingModalForm not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  const title = document.getElementById('bookingModalTitle');
  
  // Load customers and rooms
  try {
    const [customersRes, roomsRes] = await Promise.all([
      fetch(`${API_BASE}/customers`),
      fetch(`${API_BASE}/rooms`)
    ]);
    const customers = await customersRes.json();
    const rooms = await roomsRes.json();
    
    const customerSelect = document.getElementById('bookingMaKH');
    const roomSelect = document.getElementById('bookingMaPhong');
    
    customerSelect.innerHTML = '<option value="">-- Chọn khách hàng --</option>' +
      customers.map(c => `<option value="${c.MaKH}">${c.HoTen} (${c.SoDienThoai || ''})</option>`).join('');
    
    roomSelect.innerHTML = '<option value="">-- Chọn phòng --</option>' +
      rooms.map(r => `<option value="${r.MaPhong}">${r.SoPhong || r.MaPhong} - ${r.LoaiPhong || ''}</option>`).join('');
    
    if (booking) {
      title.textContent = 'Sửa đặt phòng';
      customerSelect.value = booking.MaKH || '';
      roomSelect.value = booking.MaPhong || '';
      document.getElementById('bookingNgayNhan').value = booking.NgayNhan || '';
      document.getElementById('bookingNgayTra').value = booking.NgayTra || '';
      document.getElementById('bookingSoNguoi').value = booking.SoNguoi || '';
      document.getElementById('bookingTrangThai').value = booking.TrangThai || 'cho_xac_nhan';
    } else {
      title.textContent = 'Thêm đặt phòng';
      document.getElementById('bookingFormModal').reset();
      document.getElementById('bookingTrangThai').value = 'cho_xac_nhan';
    }
  } catch (error) {
    alert('Lỗi tải dữ liệu: ' + error.message);
    return;
  }
  
  modal.classList.add('active');
}

function closeBookingModalForm() {
  document.getElementById('bookingModalForm').classList.remove('active');
  document.getElementById('bookingFormModal').reset();
  editingBookingId = null;
}

async function handleBookingFormSubmit(e) {
  e.preventDefault();
  
  const bookingData = {
    MaKH: parseInt(document.getElementById('bookingMaKH').value),
    MaPhong: parseInt(document.getElementById('bookingMaPhong').value),
    NgayNhan: document.getElementById('bookingNgayNhan').value,
    NgayTra: document.getElementById('bookingNgayTra').value,
    SoNguoi: parseInt(document.getElementById('bookingSoNguoi').value),
    TrangThai: document.getElementById('bookingTrangThai').value
  };
  
  try {
    let response;
    if (editingBookingId) {
      response = await fetch(`${API_BASE}/bookings/${editingBookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } else {
      response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    }
    
    const result = await response.json();
    if (response.ok) {
      alert(editingBookingId ? 'Cập nhật đặt phòng thành công!' : 'Thêm đặt phòng thành công!');
      closeBookingModalForm();
      loadBookings();
      loadDashboardStats();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// ==================== INVOICE MODAL ====================
let editingInvoiceId = null;

async function openInvoiceModal(invoice = null) {
  console.log('🔵 openInvoiceModal called', invoice);
  editingInvoiceId = invoice ? invoice.MaHD : null;
  const modal = document.getElementById('invoiceModal');
  if (!modal) {
    console.error('❌ Modal invoiceModal not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  const title = document.getElementById('invoiceModalTitle');
  
  // Load bookings
  try {
    const response = await fetch(`${API_BASE}/bookings`);
    const bookings = await response.json();
    
    const bookingSelect = document.getElementById('invoiceMaDatPhong');
    bookingSelect.innerHTML = '<option value="">-- Chọn đặt phòng --</option>' +
      bookings.map(b => `<option value="${b.MaDP}">Đặt phòng #${b.MaDP} - ${b.TenKH || ''}</option>`).join('');
    
    if (invoice) {
      title.textContent = 'Sửa hóa đơn';
      bookingSelect.value = invoice.MaDatPhong || '';
      document.getElementById('invoiceTongTien').value = invoice.TongTien || '';
      document.getElementById('invoicePhuongThucTT').value = invoice.PhuongThucTT || 'tien_mat';
      document.getElementById('invoiceTrangThai').value = invoice.TrangThai || 'chua_thanh_toan';
    } else {
      title.textContent = 'Thêm hóa đơn';
      document.getElementById('invoiceForm').reset();
    }
  } catch (error) {
    alert('Lỗi tải dữ liệu: ' + error.message);
    return;
  }
  
  modal.classList.add('active');
}

function closeInvoiceModal() {
  document.getElementById('invoiceModal').classList.remove('active');
  document.getElementById('invoiceForm').reset();
  editingInvoiceId = null;
}

async function handleInvoiceSubmit(e) {
  e.preventDefault();
  
  const invoiceData = {
    MaDatPhong: parseInt(document.getElementById('invoiceMaDatPhong').value),
    TongTien: parseFloat(document.getElementById('invoiceTongTien').value),
    PhuongThucTT: document.getElementById('invoicePhuongThucTT').value,
    TrangThai: document.getElementById('invoiceTrangThai').value
  };
  
  try {
    const response = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    
    const result = await response.json();
    if (response.ok) {
      alert('Thêm hóa đơn thành công!');
      closeInvoiceModal();
      if (typeof loadInvoices === 'function') {
        loadInvoices();
      }
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// ==================== USAGE MODAL ====================
let editingUsageId = null;

async function openUsageModal(usage = null) {
  console.log('🔵 openUsageModal called', usage);
  editingUsageId = usage ? usage.MaSD : null;
  const modal = document.getElementById('usageModal');
  if (!modal) {
    console.error('❌ Modal usageModal not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  const title = document.getElementById('usageModalTitle');
  
  // Load bookings and services
  try {
    const [bookingsRes, servicesRes] = await Promise.all([
      fetch(`${API_BASE}/bookings`),
      fetch(`${API_BASE}/services`)
    ]);
    const bookings = await bookingsRes.json();
    const services = await servicesRes.json();
    
    const bookingSelect = document.getElementById('usageMaDatPhong');
    const serviceSelect = document.getElementById('usageMaDV');
    
    bookingSelect.innerHTML = '<option value="">-- Chọn đặt phòng --</option>' +
      bookings.map(b => `<option value="${b.MaDP}">Đặt phòng #${b.MaDP} - ${b.TenKH || ''}</option>`).join('');
    
    serviceSelect.innerHTML = '<option value="">-- Chọn dịch vụ --</option>' +
      services.map(s => `<option value="${s.MaDV}">${s.TenDV} - ${s.DonGia && !isNaN(parseFloat(s.DonGia)) ? parseFloat(s.DonGia).toLocaleString('vi-VN') : '0'}đ</option>`).join('');
    
    if (usage) {
      title.textContent = 'Sửa sử dụng dịch vụ';
      bookingSelect.value = usage.MaDP || '';
      serviceSelect.value = usage.MaDV || '';
      document.getElementById('usageSoLuong').value = usage.SoLuong || 1;
      document.getElementById('usageNgaySuDung').value = usage.NgaySuDung || '';
    } else {
      title.textContent = 'Thêm sử dụng dịch vụ';
      document.getElementById('usageForm').reset();
      document.getElementById('usageSoLuong').value = 1;
    }
  } catch (error) {
    alert('Lỗi tải dữ liệu: ' + error.message);
    return;
  }
  
  modal.classList.add('active');
}

function closeUsageModal() {
  document.getElementById('usageModal').classList.remove('active');
  document.getElementById('usageForm').reset();
  editingUsageId = null;
}

async function handleUsageSubmit(e) {
  e.preventDefault();
  
  const usageData = {
    MaDatPhong: parseInt(document.getElementById('usageMaDatPhong').value),
    MaDV: parseInt(document.getElementById('usageMaDV').value),
    SoLuong: parseInt(document.getElementById('usageSoLuong').value),
    NgaySuDung: document.getElementById('usageNgaySuDung').value || null
  };
  
  try {
    const response = await fetch(`${API_BASE}/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usageData)
    });
    
    const result = await response.json();
    if (response.ok) {
      alert('Thêm sử dụng dịch vụ thành công!');
      closeUsageModal();
      if (typeof loadUsage === 'function') {
        loadUsage();
      }
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// ==================== USERS MANAGEMENT ====================
async function loadUsers() {
  try {
    console.log("🔄 Đang tải nhân viên...");
    const response = await fetch(`${API_BASE}/users`);
    const users = await response.json();
    console.log("✅ Nhân viên nhận được:", users.length, "items");
    if (users.length > 0) {
      console.log("📦 Nhân viên đầu tiên:", users[0]);
    }
    displayUsers(users);
  } catch (error) {
    console.error("❌ Lỗi tải nhân viên:", error);
    alert("Lỗi tải nhân viên: " + error.message);
  }
}

function displayUsers(users) {
  console.log("🎨 Bắt đầu hiển thị nhân viên...");
  const tbody = document.querySelector("#table-users tbody");
  if (!tbody) {
    console.error("❌ Không tìm thấy #table-users tbody");
    return;
  }
  tbody.innerHTML = "";
  console.log("✅ Đã clear tbody nhân viên");

  users.forEach((user) => {
    const vaiTroText = {
      'admin': 'Quản trị viên',
      'quan_ly': 'Quản lý',
      'nhan_vien': 'Nhân viên'
    };
    const vaiTroColor = {
      'admin': '#dc3545',
      'quan_ly': '#ffc107',
      'nhan_vien': '#17a2b8'
    };
    const trangThaiText = {
      'active': 'Đang hoạt động',
      'inactive': 'Vô hiệu hóa'
    };
    const trangThaiColor = {
      'active': '#28a745',
      'inactive': '#6c757d'
    };
    
    const row = `
      <tr>
        <td class="id">${user.MaUser}</td>
        <td><strong style="color: #0f4aa6;">${user.Username || '-'}</strong></td>
        <td>${user.HoTen || '-'}</td>
        <td>${user.Email || '-'}</td>
        <td><span style="color: ${vaiTroColor[user.VaiTro] || '#666'}; font-weight: bold;">${vaiTroText[user.VaiTro] || user.VaiTro}</span></td>
        <td><span style="color: ${trangThaiColor[user.TrangThai] || '#666'}; font-weight: bold;">${trangThaiText[user.TrangThai] || user.TrangThai}</span></td>
        <td class="actions">
          <button class="btn small primary" onclick="editUser(${user.MaUser})" style="margin-right: 6px;">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button class="btn small danger" onclick="deleteUser('${user.MaUser}')" ${user.VaiTro === 'admin' ? 'disabled title="Không thể xóa tài khoản admin"' : ''}>
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  console.log("✅ Đã hiển thị xong", users.length, "nhân viên");
}

let editingUserId = null;

function openUserModal(user = null) {
  console.log('🔵 openUserModal called', user);
  editingUserId = user ? user.MaUser : null;
  const modal = document.getElementById('userModal');
  if (!modal) {
    console.error('❌ Modal userModal not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  const title = document.getElementById('userModalTitle');
  const passwordInput = document.getElementById('userPassword');
  const passwordRequired = document.getElementById('passwordRequired');
  
  if (user) {
    title.textContent = 'Sửa nhân viên';
    document.getElementById('userUsername').value = user.Username || '';
    passwordInput.value = '';
    passwordInput.required = false;
    passwordRequired.style.display = 'none';
    document.getElementById('userHoTen').value = user.HoTen || '';
    document.getElementById('userEmail').value = user.Email || '';
    document.getElementById('userVaiTro').value = user.VaiTro || 'nhan_vien';
    document.getElementById('userTrangThai').value = user.TrangThai || 'active';
  } else {
    title.textContent = 'Thêm nhân viên';
    document.getElementById('userForm').reset();
    passwordInput.required = true;
    passwordRequired.style.display = 'inline';
    document.getElementById('userVaiTro').value = 'nhan_vien';
    document.getElementById('userTrangThai').value = 'active';
  }
  
  modal.classList.add('active');
}

function closeUserModal() {
  document.getElementById('userModal').classList.remove('active');
  document.getElementById('userForm').reset();
  editingUserId = null;
}

async function handleUserSubmit(e) {
  e.preventDefault();
  
  const userData = {
    Username: document.getElementById('userUsername').value,
    HoTen: document.getElementById('userHoTen').value,
    Email: document.getElementById('userEmail').value,
    VaiTro: document.getElementById('userVaiTro').value,
    TrangThai: document.getElementById('userTrangThai').value
  };
  
  const password = document.getElementById('userPassword').value;
  if (password || !editingUserId) {
    userData.Password = password;
  }
  
  try {
    let response;
    if (editingUserId) {
      response = await fetch(`${API_BASE}/users/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } else {
      if (!userData.Password) {
        alert('Vui lòng nhập mật khẩu');
        return;
      }
      response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    }
    
    const result = await response.json();
    if (response.ok) {
      alert(editingUserId ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
      closeUserModal();
      loadUsers();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function editUser(userId) {
  try {
    const response = await fetch(`${API_BASE}/users`);
    const users = await response.json();
    const user = users.find(u => u.MaUser == userId);
    if (user) {
      openUserModal(user);
    } else {
      alert('Không tìm thấy nhân viên');
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function deleteUser(userId) {
  if (!confirm(`Vô hiệu hóa nhân viên ${userId}?`)) return;
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
      alert('Vô hiệu hóa nhân viên thành công!');
      loadUsers();
    } else {
      alert('Lỗi: ' + (result.error || 'Thất bại'));
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// Make functions global
window.openCustomerModal = openCustomerModal;
window.closeCustomerModal = closeCustomerModal;
window.handleCustomerSubmit = handleCustomerSubmit;
window.editCustomer = editCustomer;
window.openRoomModal = openRoomModal;
window.closeRoomModal = closeRoomModal;
window.handleRoomSubmit = handleRoomSubmit;
window.editRoom = editRoom;
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
window.handleServiceSubmit = handleServiceSubmit;
window.editService = editService;
window.openBookingModalForm = openBookingModalForm;
window.closeBookingModalForm = closeBookingModalForm;
window.handleBookingFormSubmit = handleBookingFormSubmit;
window.openInvoiceModal = openInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.handleInvoiceSubmit = handleInvoiceSubmit;
window.openUsageModal = openUsageModal;
window.closeUsageModal = closeUsageModal;
window.handleUsageSubmit = handleUsageSubmit;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.handleUserSubmit = handleUserSubmit;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.loadUsers = loadUsers;
window.deleteBooking = deleteBooking;
window.deleteService = deleteService;
window.deleteCustomer = deleteCustomer;
window.deleteRoom = deleteRoom;

window.deleteItem = async function (type, id) {
  if (!confirm(`Xóa ${id}?`)) return;
  try {
    if (type === "customers") {
      const response = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Xóa khách hàng thất bại');
      await loadCustomers();
    } else if (type === "rooms") {
      const response = await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Xóa phòng thất bại');
      await loadRooms();
    } else if (type === "services") {
      const response = await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Xóa dịch vụ thất bại');
      await loadServices();
    }
    alert("✅ Xóa thành công");
  } catch (error) {
    alert("❌ Lỗi khi xóa: " + error.message);
  }
};

async function deleteCustomer(customerId) {
  await deleteItem("customers", customerId);
}
async function deleteRoom(roomId) {
  await deleteItem("rooms", roomId);
}
async function deleteService(serviceId) {
  await deleteItem("services", serviceId);
}
async function deleteBooking(bookingId) {
  if (!confirm(`Xóa đặt phòng #${bookingId}?`)) return;
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
      alert('✅ Xóa đặt phòng thành công!');
      loadBookings();
      loadDashboardStats();
    } else {
      alert('❌ Lỗi: ' + (result.error || 'Xóa thất bại'));
    }
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  }
}

function generateId(kind) {
  const map = { customers: "KH", rooms: "P", services: "DV" };
  return map[kind] + String(Math.floor(Math.random() * 900) + 100);
}

// ==================== NAVIGATION ====================
// Function này sẽ được override ở cuối file
function showPage(page) {
  console.log('🔄 showPage (old) called with:', page);
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
    p.classList.remove('active');
  });
  const el = document.getElementById("page-" + page);
  if (el) {
    el.style.display = "block";
    el.classList.add('active');
    el.style.opacity = "1";
    console.log('✅ Đã hiển thị page (old):', page, el);
  }
  const panelTitle = document.getElementById("panelTitle");
  if (panelTitle) {
    panelTitle.textContent =
    document.querySelector('[data-page="' + page + '"]')?.textContent ||
    "NORTHWEST";
  }

  // Load data khi chuyển trang
  if (page === "customers") loadCustomers();
  else if (page === "rooms") loadRooms();
  else if (page === "services") loadServices();
  else if (page === "bookings") loadBookings();
  else if (page === "invoices") loadInvoices();
  else if (page === "usage") loadUsage();
  else if (page === "users") loadUsers();
  else if (page === "home") loadDashboardStats();
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM đã loaded - Khởi động ứng dụng...");

  // Navigation
  document.querySelectorAll(".nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".nav button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showPage(btn.dataset.page);
    });
  });

  // Auto load trang đầu
  setTimeout(() => {
    if (window.showPage) {
      window.showPage("home");
    } else {
      showPage("home");
    }
  }, 1000);
});

// Test connection
async function testConnection() {
  try {
    const response = await fetch(`${API_BASE}/test`);
    const data = await response.json();
    console.log("✅ Kết nối backend:", data);
  } catch (error) {
    console.error("❌ Lỗi kết nối backend:", error);
  }
}
testConnection();

console.log("✅ Tất cả functions đã được khai báo!");

// ==================== DASHBOARD ====================
async function loadDashboardStats() {
  try {
    const [roomsRes, customersRes, bookingsRes, invoicesRes] = await Promise.all([
      fetch(`${API_BASE}/rooms`),
      fetch(`${API_BASE}/customers`),
      fetch(`${API_BASE}/bookings`),
      fetch(`${API_BASE}/invoices`)
    ]);
    
    const rooms = await roomsRes.json();
    const customers = await customersRes.json();
    const bookings = await bookingsRes.json();
    const invoices = await invoicesRes.json();
    
    // Update stats
    document.getElementById('stat-rooms').textContent = rooms.length;
    document.getElementById('stat-customers').textContent = customers.length;
    document.getElementById('stat-bookings').textContent = bookings.length;
    
    // Calculate revenue from PAID invoices only
    const revenue = invoices
      .filter(inv => inv.TrangThai === 'da_thanh_toan')
      .reduce((sum, inv) => sum + (parseFloat(inv.TongTien) || 0), 0);
    
    // Format revenue with proper handling for large numbers
    const revenueElement = document.getElementById('stat-revenue');
    const formattedRevenue = revenue.toLocaleString('vi-VN') + ' đ';
    revenueElement.textContent = formattedRevenue;
    
    // Auto-adjust font size if number is too long
    if (formattedRevenue.length > 20) {
      revenueElement.style.fontSize = '22px';
    } else if (formattedRevenue.length > 15) {
      revenueElement.style.fontSize = '24px';
    } else {
      revenueElement.style.fontSize = '28px';
    }
    
    // Room status stats
    const emptyRooms = rooms.filter(r => r.TinhTrang === 'trong' || r.TrangThai === 'Trống').length;
    const bookedRooms = rooms.filter(r => r.TinhTrang === 'da_dat' || r.TrangThai === 'Đã đặt').length;
    const usingRooms = rooms.filter(r => r.TinhTrang === 'dang_su_dung' || r.TrangThai === 'Đang sử dụng').length;
    
    document.getElementById('stat-empty-rooms').textContent = emptyRooms;
    document.getElementById('stat-booked-rooms').textContent = bookedRooms;
    document.getElementById('stat-using-rooms').textContent = usingRooms;
  } catch (error) {
    console.error('Lỗi load dashboard:', error);
  }
}

// ==================== BOOKING MODAL ====================
async function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.add('active');
  
  // Load customers and rooms
  try {
    const [customersRes, roomsRes] = await Promise.all([
      fetch(`${API_BASE}/customers`),
      fetch(`${API_BASE}/rooms`)
    ]);
    
    const customers = await customersRes.json();
    const rooms = await roomsRes.json();
    
    const customerSelect = document.getElementById('bookingCustomer');
    customerSelect.innerHTML = '<option value="">-- Chọn khách hàng --</option>';
    customers.forEach(c => {
      const option = document.createElement('option');
      option.value = c.MaKH;
      option.textContent = `${c.HoTen} (${c.Email || 'N/A'})`;
      customerSelect.appendChild(option);
    });
    
    const roomSelect = document.getElementById('bookingRoom');
    roomSelect.innerHTML = '<option value="">-- Chọn phòng --</option>';
    rooms.filter(r => r.TinhTrang === 'trong' || r.TrangThai === 'Trống').forEach(r => {
      const option = document.createElement('option');
      option.value = r.MaPhong;
      option.textContent = `${r.SoPhong || r.MaPhong} - ${r.LoaiPhong || 'N/A'} (${r.GiaPhong && !isNaN(parseFloat(r.GiaPhong)) ? parseFloat(r.GiaPhong).toLocaleString('vi-VN') + ' đ' : 'N/A'})`;
      roomSelect.appendChild(option);
    });
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingCheckIn').min = today;
    document.getElementById('bookingCheckOut').min = today;
  } catch (error) {
    alert('Lỗi khi tải dữ liệu: ' + error.message);
  }
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('active');
  document.getElementById('bookingForm').reset();
}

async function handleBookingSubmit(e) {
  e.preventDefault();
  
  const bookingData = {
    MaKH: parseInt(document.getElementById('bookingCustomer').value),
    MaPhong: parseInt(document.getElementById('bookingRoom').value),
    NgayNhan: document.getElementById('bookingCheckIn').value,
    NgayTra: document.getElementById('bookingCheckOut').value,
    SoNguoi: parseInt(document.getElementById('bookingGuests').value),
    TrangThai: 'cho_xac_nhan'
  };
  
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    if (response.ok) {
      alert('✅ Đặt phòng thành công!');
      closeBookingModal();
      loadBookings();
      loadDashboardStats();
    } else {
      alert('❌ Lỗi: ' + (result.error || 'Đặt phòng thất bại'));
    }
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  }
}

// ==================== CHECK-IN/CHECK-OUT ====================
async function showCheckInOut() {
  console.log('🔵 showCheckInOut called');
  const modal = document.getElementById('checkInOutModal');
  if (!modal) {
    console.error('❌ Modal checkInOutModal not found!');
    alert('Không tìm thấy form modal!');
    return;
  }
  modal.classList.add('active');
  console.log('✅ Modal checkInOutModal opened');
  await loadBookingsForCheckInOut();
}

function closeCheckInOutModal() {
  document.getElementById('checkInOutModal').classList.remove('active');
}

async function loadBookingsForCheckInOut() {
  try {
    const response = await fetch(`${API_BASE}/bookings`);
    const bookings = await response.json();
    
    const container = document.getElementById('bookingList');
    container.innerHTML = '';
    
    if (bookings.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Không có đặt phòng nào</p>';
      return;
    }
    
    bookings.forEach(booking => {
      const card = document.createElement('div');
      card.className = 'quick-stat';
      card.style.marginBottom = '12px';
      
      const statusActions = {
        'cho_xac_nhan': '<button class="btn success small" onclick="updateBookingStatus(' + booking.MaDP + ', \'da_xac_nhan\')">Xác nhận</button>',
        'da_xac_nhan': '<button class="btn primary small" onclick="updateBookingStatus(' + booking.MaDP + ', \'da_checkin\')">Check-in</button>',
        'da_checkin': '<button class="btn warning small" onclick="updateBookingStatus(' + booking.MaDP + ', \'da_checkout\')">Check-out</button>',
        'da_checkout': '<span style="color: #6c757d;">Đã hoàn thành</span>',
        'da_huy': '<span style="color: #dc3545;">Đã hủy</span>'
      };
      
      card.innerHTML = `
        <div style="flex: 1;">
          <div style="font-weight: 600; color: var(--deep); margin-bottom: 4px;">
            #${booking.MaDP} - ${booking.TenKH || 'N/A'}
          </div>
          <div style="font-size: 13px; color: #666;">
            Phòng: ${booking.MaPhong || 'N/A'} | 
            ${booking.NgayNhan ? new Date(booking.NgayNhan).toLocaleDateString('vi-VN') : 'N/A'} - 
            ${booking.NgayTra ? new Date(booking.NgayTra).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
          <div style="font-size: 12px; color: #999; margin-top: 4px;">
            Trạng thái: <strong>${booking.TrangThaiText || booking.TrangThai || 'N/A'}</strong>
          </div>
        </div>
        <div>
          ${statusActions[booking.TrangThai] || ''}
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Lỗi load bookings:', error);
  }
}

async function searchBookingForCheckInOut() {
  const search = document.getElementById('searchBooking').value.toLowerCase();
  const cards = document.getElementById('bookingList').children;
  
  for (let card of cards) {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(search) ? 'flex' : 'none';
  }
}

async function updateBookingStatus(bookingId, newStatus) {
  try {
    // Sử dụng endpoint riêng để cập nhật chỉ trạng thái
    const updateResponse = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TrangThai: newStatus })
    });
    
    const result = await updateResponse.json();
    
    if (updateResponse.ok) {
      alert('✅ Cập nhật trạng thái thành công!');
      await loadBookingsForCheckInOut();
      loadBookings();
      loadDashboardStats();
    } else {
      alert('❌ Lỗi: ' + (result.error || 'Cập nhật trạng thái thất bại'));
      console.error('Update status error:', result);
    }
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
    console.error('Update status exception:', error);
  }
}

// Loading state management
function showPageLoading(pageElement) {
  if (!pageElement) return;
  
  // Create or get loading overlay
  let overlay = pageElement.querySelector('.loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    pageElement.appendChild(overlay);
  }
  
  // Show loading
  setTimeout(() => {
    overlay.classList.add('active');
    pageElement.classList.add('loading');
  }, 10);
}

function hidePageLoading(pageElement) {
  if (!pageElement) return;
  
  const overlay = pageElement.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    pageElement.classList.remove('loading');
    // Remove overlay after animation
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.remove();
      }
    }, 300);
  }
}

// Load dashboard when home page is shown
// Override showPage to load dashboard stats
const originalShowPage = window.showPage || showPage;
// Prevent duplicate calls
let showPageInProgress = false;

window.showPage = async function(page) {
  // Store current page to load data even if duplicate call
  const currentPage = page;
  
  // Prevent duplicate calls for display logic only
  if (showPageInProgress) {
    console.log('⏸️ showPage already in progress, but will still load data for:', currentPage);
    // Still load data even if display is in progress
    try {
      if (currentPage === "customers") {
        await loadCustomers();
      } else if (currentPage === "rooms") {
        await loadRooms();
      } else if (currentPage === "services") {
        await loadServices();
      } else if (currentPage === "bookings") {
        await loadBookings();
      } else if (currentPage === "invoices") {
        await loadInvoices();
      } else if (currentPage === "usage") {
        await loadUsage();
      } else if (currentPage === "users") {
        await loadUsers();
      } else if (currentPage === "home") {
        await loadDashboardStats();
      }
    } catch (error) {
      console.error('Error loading page data (duplicate call):', error);
    }
    return;
  }
  
  showPageInProgress = true;
  console.log('🔄 showPage called with:', page);
  
  let el = null;
  
  try {
    // QUAN TRỌNG: Tìm và set display: block cho page hiện tại TRƯỚC khi hide các pages khác
    el = document.getElementById("page-" + page);
    if (!el) {
      console.error('❌ Không tìm thấy page:', 'page-' + page);
      showPageInProgress = false;
      return;
    }
    
    // CRITICAL: Set display: block cho page hiện tại TRƯỚC khi hide các pages khác
    // Store current page ID để tránh bị hide nhầm
    const currentPageId = "page-" + page;
    
    // Set display: block với !important TRƯỚC - KHÔNG remove property trước
    el.classList.add('active');
    el.style.setProperty('display', 'block', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    
    // Force immediate reflow để đảm bảo styles được apply
    void el.offsetHeight;
    
    // SAU ĐÓ mới hide các pages khác - đảm bảo không hide page hiện tại
    // Collect all pages to hide first, then hide them
    const pagesToHide = [];
    document.querySelectorAll(".page").forEach((p) => {
      // Triple check: không hide page hiện tại
      if (p.id !== currentPageId && p !== el && p.id) {
        pagesToHide.push(p);
      }
    });
    
    // Hide other pages - ĐẢM BẢO không ảnh hưởng đến page hiện tại
    pagesToHide.forEach((p) => {
      // QUADRUPLE check: không hide page hiện tại
      if (p.id !== currentPageId && p !== el && p.id && !p.classList.contains('active') || p.id !== currentPageId) {
        p.classList.remove('active');
        p.style.setProperty('display', 'none', 'important');
      }
    });
    
    // CRITICAL: Đảm bảo page hiện tại LUÔN có class active và display: block
    // Phải làm SAU KHI hide các pages khác để tránh bị ảnh hưởng
    if (!el.classList.contains('active')) {
      console.warn('⚠️ Class active bị thiếu sau khi hide pages! Đang add lại...', page);
    }
    el.classList.add('active'); // LUÔN add, không check
    el.style.setProperty('display', 'block', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    
    // Force reflow để đảm bảo styles được apply
    void el.offsetHeight;
    
    // Final check: đảm bảo computed style là block VÀ có class active
    const finalComputedDisplay = window.getComputedStyle(el).display;
    const hasActiveClass = el.classList.contains('active');
    
    if (finalComputedDisplay === 'none' || !hasActiveClass) {
      console.error('❌ CRITICAL: Page bị ẩn hoặc thiếu class active!', {
        page,
        computedDisplay,
        hasActiveClass,
        inlineDisplay: el.style.getPropertyValue('display')
      });
      
      // Force remove ALL display-related properties
      el.style.removeProperty('display');
      el.style.removeProperty('opacity');
      el.style.removeProperty('visibility');
      
      // Force reflow
      void el.offsetHeight;
      
      // Set lại với !important và class active
      el.classList.add('active');
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      
      // Force reflow again
      void el.offsetHeight;
      
      const afterFix = window.getComputedStyle(el).display;
      const afterFixActive = el.classList.contains('active');
      console.log('   - After fix - computed:', afterFix, 'has active:', afterFixActive);
      
      if (afterFix === 'none' || !afterFixActive) {
        console.error('❌❌❌ VẪN BỊ ẨN SAU KHI FIX! Có thể do CSS hoặc code khác!');
      }
    }
    
    // CRITICAL: Đảm bảo class active được add TRƯỚC KHI log
    if (!el.classList.contains('active')) {
      console.warn('⚠️ Class active bị thiếu! Đang add lại...', page);
      el.classList.add('active');
    }
    
    // Log với thông tin đầy đủ
    const logHasActive = el.classList.contains('active');
    const logInlineDisplay = el.style.getPropertyValue('display');
    const logComputedDisplay = window.getComputedStyle(el).display;
    console.log('✅ Đã hiển thị page:', page);
    console.log('   - has active class:', logHasActive);
    console.log('   - inline display:', logInlineDisplay);
    console.log('   - computed display:', logComputedDisplay);
    console.log('   - element:', el);
    
    // Nếu không có class active, force add lại
    if (!logHasActive) {
      el.classList.add('active');
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
    }
  
    // Update title
    const panelTitle = document.getElementById("panelTitle");
    if (panelTitle) {
      panelTitle.textContent =
        document.querySelector('[data-page="' + page + '"]')?.textContent ||
        "NORTHWEST";
    }
    
    // Show loading (KHÔNG ảnh hưởng đến display của page)
    showPageLoading(el);
    
    // Đảm bảo display và opacity vẫn đúng sau showPageLoading - KHÔNG remove, chỉ set lại
    el.style.setProperty('display', 'block', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.classList.add('active');
    
    // Wait a bit for smooth transition
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Đảm bảo display và opacity vẫn đúng sau delay - KHÔNG remove, chỉ set lại
    el.style.setProperty('display', 'block', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.classList.add('active');
    
    // Load data when switching pages
    try {
      if (page === "customers") {
        await loadCustomers();
      } else if (page === "rooms") {
        await loadRooms();
      } else if (page === "services") {
        await loadServices();
      } else if (page === "bookings") {
        await loadBookings();
      } else if (page === "invoices") {
        await loadInvoices();
      } else if (page === "usage") {
        await loadUsage();
      } else if (page === "users") {
        await loadUsers();
      } else if (page === "home") {
        await loadDashboardStats();
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    }
  } catch (error) {
    console.error('Error in showPage:', error);
  } finally {
    // Hide loading and show content with fade-in
    if (el) {
      hidePageLoading(el);
      
      // Hide loading overlay
      hidePageLoading(el);
      
      // CRITICAL: Đảm bảo page vẫn hiển thị sau khi hide loading
      // KHÔNG remove property - chỉ set lại để đảm bảo không bị override
      el.classList.add('active');
      el.classList.remove('loading'); // Remove loading class để không bị opacity: 0.5
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      
      // Force reflow để đảm bảo styles được apply
      void el.offsetHeight;
      
      // Double check sau reflow - đảm bảo vẫn hiển thị
      const computedDisplay = window.getComputedStyle(el).display;
      if (computedDisplay === 'none') {
        console.warn('⚠️ Page bị ẩn sau hidePageLoading, đang fix lại...', page);
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
        el.classList.add('active');
      }
      
      // Double check sau một frame
      requestAnimationFrame(() => {
        if (el && el.classList.contains('active')) {
          el.classList.remove('loading');
          const computed = window.getComputedStyle(el).display;
          if (computed === 'none') {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          }
        }
      });
      
      // Triple check sau 2 frames để đảm bảo
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (el && el.classList.contains('active')) {
            el.classList.remove('loading');
            const computed = window.getComputedStyle(el).display;
            if (computed === 'none') {
              el.style.setProperty('display', 'block', 'important');
              el.style.setProperty('opacity', '1', 'important');
              el.style.setProperty('visibility', 'visible', 'important');
            }
          }
        });
      });
      
      // Final check và log chi tiết - CHỈ dựa vào computed style
      const finalComputed = window.getComputedStyle(el).display;
      const hasActive = el.classList.contains('active');
      const hasLoading = el.classList.contains('loading');
      
      console.log('✅ Final state - page:', page);
      console.log('   - computed display:', finalComputed);
      console.log('   - has active class:', hasActive);
      console.log('   - has loading class:', hasLoading);
      
      // CRITICAL: Nếu computed style là none, force hiển thị lại
      // Không check inline style vì có thể có !important conflict
      if (finalComputed === 'none') {
        console.error('❌ CRITICAL ERROR: Page bị ẩn (computed=none)! Đang force hiển thị...', page);
        // Remove ALL display-related properties first
        el.style.removeProperty('display');
        el.style.removeProperty('opacity');
        el.style.removeProperty('visibility');
        // Force reflow
        void el.offsetHeight;
        // Set lại với !important
        el.classList.add('active');
        el.classList.remove('loading');
            el.style.setProperty('display', 'block', 'important');
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
        // Force reflow again
        void el.offsetHeight;
        const afterFix = window.getComputedStyle(el).display;
        console.log('   - After fix, computed:', afterFix);
        if (afterFix === 'none') {
          console.error('❌❌❌ VẪN BỊ ẨN SAU KHI FIX! Có thể do CSS hoặc code khác đang override!');
        }
      } else {
        // Đảm bảo có active class
        const finalHasActive = el.classList.contains('active');
        if (!finalHasActive) {
          el.classList.add('active');
        }
      }
      
      // Đơn giản: Đảm bảo .content container được hiển thị
      const contentContainer = document.querySelector('.content');
      if (contentContainer) {
        const contentDisplay = window.getComputedStyle(contentContainer).display;
        if (contentDisplay === 'none') {
          contentContainer.style.setProperty('display', 'flex', 'important');
        }
      }
      
      // Đảm bảo #pages container được hiển thị
      const pagesContainer = document.getElementById('pages');
      if (pagesContainer) {
        const pagesDisplay = window.getComputedStyle(pagesContainer).display;
        if (pagesDisplay === 'none') {
          pagesContainer.style.setProperty('display', 'block', 'important');
        }
      }
    }
    
    showPageInProgress = false;
  }
};

// Make functions global
window.addRow = addRow;
window.openCustomerModal = openCustomerModal;
window.closeCustomerModal = closeCustomerModal;
window.handleCustomerSubmit = handleCustomerSubmit;
window.editCustomer = editCustomer;
window.openRoomModal = openRoomModal;
window.closeRoomModal = closeRoomModal;
window.handleRoomSubmit = handleRoomSubmit;
window.editRoom = editRoom;
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
window.handleServiceSubmit = handleServiceSubmit;
window.editService = editService;
window.openBookingModalForm = openBookingModalForm;
window.closeBookingModalForm = closeBookingModalForm;
window.handleBookingFormSubmit = handleBookingFormSubmit;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.handleBookingSubmit = handleBookingSubmit;
window.openInvoiceModal = openInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.handleInvoiceSubmit = handleInvoiceSubmit;
window.openUsageModal = openUsageModal;
window.closeUsageModal = closeUsageModal;
window.handleUsageSubmit = handleUsageSubmit;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.handleUserSubmit = handleUserSubmit;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.showCheckInOut = showCheckInOut;
window.closeCheckInOutModal = closeCheckInOutModal;
window.searchBookingForCheckInOut = searchBookingForCheckInOut;
window.updateBookingStatus = updateBookingStatus;
window.loadInvoices = loadInvoices;
window.loadUsage = loadUsage;
window.deleteInvoice = deleteInvoice;
window.deleteUsage = deleteUsage;
window.loadUsers = loadUsers;

// ==================== QR PAYMENT ====================
let currentQRInvoiceId = null;
let paymentCheckInterval = null;

function showQRPayment(invoiceId, amount, invoiceCode) {
  currentQRInvoiceId = invoiceId;
  
  // Xóa QR code cũ nếu có
  const qrContainer = document.getElementById('qrCodeContainer');
  qrContainer.innerHTML = '';
  
  // Cập nhật thông tin
  document.getElementById('qrAmount').textContent = amount.toLocaleString('vi-VN') + ' đ';
  document.getElementById('qrContent').textContent = `Thanh toan HD ${invoiceCode}`;
  
  // Tạo QR code động (sử dụng VietQR API)
  generateDynamicQR(amount, invoiceCode);
  
  // Hiển thị modal
  document.getElementById('qrPaymentModal').classList.add('active');
  
  // Bắt đầu kiểm tra thanh toán tự động
  startAutoPaymentCheck(invoiceId);
}


async function generateDynamicQR(amount, invoiceCode) {
  const qrContainer = document.getElementById('qrCodeContainer');
  qrContainer.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #0f4aa6;"></i><p style="margin-top: 10px;">Đang tạo QR code...</p></div>';
  
  const accountNumber = '100878031328';
  const bankCode = '970415'; // Vietinbank
  const content = `Thanh toan HD ${invoiceCode}`;
  const template = 'compact'; // compact, compact2, qr_only, print
  
  // Sử dụng VietQR Quicklink API
  // Format: https://img.vietqr.io/image/{bankCode}-{accountNumber}-{template}.jpg?amount={amount}&addInfo={content}
  // Lưu ý: URL phải có query parameters để tạo QR code động với số tiền và nội dung
  const vietqrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.jpg?amount=${amount}&addInfo=${encodeURIComponent(content)}`;
  
  try {
    // Tạo img element với VietQR URL
    qrContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = vietqrUrl;
    img.alt = 'VietQR Code';
    img.style.cssText = 'max-width: 300px; max-height: 300px; border: 2px solid #ddd; border-radius: 10px; padding: 10px; background: white;';
    
    // Kiểm tra xem ảnh có load được không
    img.onload = function() {
      console.log('✅ QR code đã tải thành công từ VietQR');
    };
    
    img.onerror = function() {
      console.error('❌ Không thể tải QR code từ VietQR, URL:', vietqrUrl);
      // Fallback: Hiển thị thông tin chuyển khoản
      qrContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <p style="color: #dc3545; font-weight: bold; margin-bottom: 10px;">⚠️ Không thể tạo QR code</p>
          <p style="font-size: 14px; color: #666;">Vui lòng chuyển khoản thủ công:</p>
          <p style="font-size: 16px; color: #0f4aa6; font-weight: bold; margin: 10px 0;">STK: ${accountNumber}</p>
          <p style="font-size: 14px; color: #0f4aa6;">Ngân hàng: Vietinbank</p>
          <p style="font-size: 14px; color: #0f4aa6;">Số tiền: ${amount.toLocaleString('vi-VN')} đ</p>
          <p style="font-size: 14px; color: #666;">Nội dung: ${content}</p>
        </div>
      `;
    };
    
    qrContainer.appendChild(img);
  } catch (error) {
    console.error('Lỗi tạo QR code:', error);
    qrContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <p style="color: #dc3545; font-weight: bold; margin-bottom: 10px;">⚠️ Không thể tạo QR code</p>
        <p style="font-size: 14px; color: #666;">Vui lòng chuyển khoản thủ công:</p>
        <p style="font-size: 16px; color: #0f4aa6; font-weight: bold; margin: 10px 0;">STK: ${accountNumber}</p>
        <p style="font-size: 14px; color: #0f4aa6;">Ngân hàng: Vietinbank</p>
        <p style="font-size: 14px; color: #0f4aa6;">Số tiền: ${amount.toLocaleString('vi-VN')} đ</p>
        <p style="font-size: 14px; color: #666;">Nội dung: ${content}</p>
      </div>
    `;
  }
}



// Kiểm tra thanh toán tự động (polling)
function startAutoPaymentCheck(invoiceId) {
  const checkDiv = document.getElementById('autoCheckPayment');
  const statusSpan = document.getElementById('autoCheckStatus');
  
  if (!checkDiv || !statusSpan) return;
  
  // Hiển thị phần kiểm tra tự động
  checkDiv.style.display = 'block';
  statusSpan.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Đang kiểm tra thanh toán tự động...';
  checkDiv.style.background = '#d1ecf1';
  checkDiv.style.borderColor = '#17a2b8';
  checkDiv.style.color = '#0c5460';
  
  let checkCount = 0;
  const maxChecks = 120; // Kiểm tra tối đa 120 lần (10 phút, mỗi 5 giây)
  
  // Dừng interval cũ nếu có
  if (paymentCheckInterval) {
    clearInterval(paymentCheckInterval);
  }
  
  paymentCheckInterval = setInterval(async () => {
    checkCount++;
    
    try {
      const response = await fetch(`${API_BASE}/payment/check/${invoiceId}`);
      const data = await response.json();
      
      if (data.isPaid) {
        // Đã thanh toán thành công!
        clearInterval(paymentCheckInterval);
        paymentCheckInterval = null;
        
        statusSpan.innerHTML = '<i class="fas fa-check-circle" style="color: #28a745;"></i> <strong>Đã nhận được thanh toán!</strong>';
        checkDiv.style.background = '#d4edda';
        checkDiv.style.borderColor = '#28a745';
        checkDiv.style.color = '#155724';
        
        // Tự động cập nhật UI sau 2 giây
        setTimeout(() => {
          loadInvoices();
          loadDashboardStats();
          alert('✅ Đã nhận được thanh toán tự động! Hóa đơn đã được cập nhật.');
          closeQRPaymentModal();
        }, 2000);
      } else {
        // Chưa thanh toán, tiếp tục kiểm tra
        const minutes = Math.floor((checkCount * 5) / 60);
        const seconds = (checkCount * 5) % 60;
        statusSpan.innerHTML = `<i class="fas fa-sync-alt fa-spin"></i> Đang kiểm tra... (${minutes}:${String(seconds).padStart(2, '0')} / 10:00)`;
      }
      
      // Dừng sau 10 phút
      if (checkCount >= maxChecks) {
        clearInterval(paymentCheckInterval);
        paymentCheckInterval = null;
        statusSpan.innerHTML = '<i class="fas fa-clock"></i> Đã dừng kiểm tra tự động. Vui lòng kiểm tra thủ công hoặc nhấn "Đã thanh toán".';
        checkDiv.style.background = '#fff3cd';
        checkDiv.style.borderColor = '#ffc107';
        checkDiv.style.color = '#856404';
      }
    } catch (error) {
      console.error('Lỗi kiểm tra thanh toán:', error);
      if (checkCount >= maxChecks) {
        clearInterval(paymentCheckInterval);
        paymentCheckInterval = null;
      }
    }
  }, 5000); // Kiểm tra mỗi 5 giây
}

function stopAutoPaymentCheck() {
  if (paymentCheckInterval) {
    clearInterval(paymentCheckInterval);
    paymentCheckInterval = null;
  }
  const checkDiv = document.getElementById('autoCheckPayment');
  if (checkDiv) {
    checkDiv.style.display = 'none';
  }
}

function closeQRPaymentModal() {
  stopAutoPaymentCheck();
  document.getElementById('qrPaymentModal').classList.remove('active');
  const qrContainer = document.getElementById('qrCodeContainer');
  qrContainer.innerHTML = '';
  currentQRInvoiceId = null;
}

async function confirmQRPayment() {
  if (!currentQRInvoiceId) {
    alert('Không tìm thấy hóa đơn');
    return;
  }
  
  if (!confirm('Xác nhận khách hàng đã thanh toán thành công?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/invoices/${currentQRInvoiceId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TrangThai: 'da_thanh_toan' })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert('✅ Cập nhật trạng thái thanh toán thành công!');
      closeQRPaymentModal();
      loadInvoices();
      loadDashboardStats();
    } else {
      alert('❌ Lỗi: ' + (result.error || 'Cập nhật thất bại'));
    }
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  }
}

window.showQRPayment = showQRPayment;
window.closeQRPaymentModal = closeQRPaymentModal;
window.confirmQRPayment = confirmQRPayment;
window.stopAutoPaymentCheck = stopAutoPaymentCheck;
