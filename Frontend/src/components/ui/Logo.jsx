/*
  Small reusable SVG logo component.
*/
import React from 'react'

export default function Logo({ className = '', ariaHidden = false }) {
  return (
    <div className={className} aria-hidden={ariaHidden}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 241.33 336.96" aria-hidden="true" focusable="false">
        <path d="M46.26,310.73h37v11.92c0,6.55-5.32,11.87-11.87,11.87h-13.26c-6.55,0-11.87-5.32-11.87-11.87v-11.92h0Z" fill="#f9fafb"/>
        <path d="M157.26,311.73h37v11.92c0,6.55-5.32,11.87-11.87,11.87h-13.26c-6.55,0-11.87-5.32-11.87-11.87v-11.92h0Z" fill="#f9fafb"/>
        <path d="M64.65,2.49h111.33c34.33,0,62.17,27.83,62.17,62.17v75.81H2.49v-75.81C2.49,30.33,30.32,2.49,64.65,2.49Z" fill="#f9fafb"/>
        <path d="M238.49,140.5H2.83v114.68c0,33.79,27.39,61.18,61.18,61.18h113.3c33.79,0,61.18-27.39,61.18-61.18v-114.68Z" fill="#aaf9f7"/>
        <circle cx="171.89" cy="222.44" r="38.25" transform="translate(-75.22 356.48) rotate(-80.78)" fill="#f9fafb" stroke="#000" strokeMiterlimit="10" strokeWidth="5.67"/>
        <rect x="2.84" y="2.84" width="235.66" height="313.53" rx="61.57" ry="61.57" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="5.67"/>
        <path d="M49.28,181.81v43.02c0,10.85-16.4,10.85-16.4,0v-43.02c0-10.85,16.4-10.85,16.4,0Z" fill="#f9fafb" stroke="#000" strokeMiterlimit="10" strokeWidth="5.67"/>
        <path d="M71.14,51.33c25.3,0,25.3,38.25,0,38.25s-25.3-38.25,0-38.25Z"/>
        <path d="M170.18,51.33c25.3,0,25.3,38.25,0,38.25s-25.3-38.25,0-38.25Z"/>
        <path d="M84.11,316.37v3.18c0,8.05-6.52,14.58-14.58,14.58h-9.11c-8.05,0-14.58-6.52-14.58-14.58v-6.02" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="5.67"/>
        <path d="M157.2,316.37v3.18c0,8.05,6.52,14.58,14.58,14.58h9.11c8.05,0,14.58-6.52,14.58-14.58v-6.02" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="5.67"/>
        <path d="M137.09,90.95c0,21.15-32.87,21.47-32.87,0" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.67"/>
        <path d="M70.32,67.73c.48-9.03,12.23-8.4,11.75.62s-12.23,8.4-11.75-.62Z" fill="#f9fafb"/>
        <path d="M164.99,61.22c7.78,0,7.78,13.66,0,13.66s-7.78-13.66,0-13.66Z" fill="#f9fafb"/>
        <line x1="2.83" y1="140.5" x2="238.49" y2="140.5" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="5.67"/>
        <circle cx="171.89" cy="222.44" r="38.25" transform="translate(-75.22 356.48) rotate(-80.78)" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="5.67"/>
        <polyline points="171.89 203.32 171.89 222.44 179.16 229.71" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.67"/>
      </svg>
    </div>
  )
}
