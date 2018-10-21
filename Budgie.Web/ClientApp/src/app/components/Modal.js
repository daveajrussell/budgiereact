import React from 'react';
import { ButtonSpinner } from './ButtonSpinner';

export const Modal = ({ handleClose, handleSave, show, title, children, loading, buttonClass = 'is-primary' }) => {
    const showHideClassName = show ? "modal is-active" : "modal";
    return (
        <div className={showHideClassName}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                </header>
                <section className="modal-card-body">
                    {children}
                </section>
                <footer className="modal-card-foot">
                    <ButtonSpinner buttonClass={buttonClass} loading={loading} handleClick={handleSave} text="Save changes" />
                    <button className="button" onClick={handleClose}>Cancel</button>
                </footer>
            </div>
        </div>
    );
}