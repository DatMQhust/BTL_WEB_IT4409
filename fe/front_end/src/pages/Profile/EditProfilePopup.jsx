import React, { useState } from 'react';
import './EditProfilePopup.css';

const EditProfilePopup = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone || '');
    const [address, setAddress] = useState(user.address || '');


    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, email, phone, address });
    };

    return (
        <div className="edit-profile-popup-overlay">
            <div className="edit-profile-popup-content">
                <h2 className="popup-title">Chỉnh sửa thông tin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Số điện thoại</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address" className="form-label">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-cancel"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-save"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePopup;
