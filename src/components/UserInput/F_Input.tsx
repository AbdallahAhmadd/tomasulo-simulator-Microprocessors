
import React from 'react';

interface F_InputProps {
  value: string; // Current selected value in the dropdown menu
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const F_Input: React.FC<F_InputProps> = ({ value, label, onChange }) => {
  return (
    <div>
      <label>Floating-Point Registers (F{label}):</label>
      <select value={value} onChange={onChange}>
        <option value="" disabled selected>Select a register</option>
        <option value="F0">F0</option>
        <option value="F1">F1</option>
        <option value="F2">F2</option>
        <option value="F3">F3</option>
        <option value="F4">F4</option>
        <option value="F5">F5</option>
        <option value="F6">F6</option>
        <option value="F7">F7</option>
        <option value="F8">F8</option>
        <option value="F9">F9</option>
        <option value="F10">F10</option>
        <option value="F11">F11</option>
        <option value="F12">F12</option>
        <option value="F13">F13</option>
        <option value="F14">F14</option>
        <option value="F15">F15</option>
        <option value="F16">F16</option>
        <option value="F17">F17</option>
        <option value="F18">F18</option>
        <option value="F19">F19</option>
        <option value="F20">F20</option>
        <option value="F21">F21</option>
        <option value="F22">F22</option>
        <option value="F23">F23</option>
        <option value="F24">F24</option>
        <option value="F25">F25</option>
        <option value="F26">F26</option>
        <option value="F27">F27</option>
        <option value="F28">F28</option>
        <option value="F29">F29</option>
        <option value="F30">F30</option>
        <option value="F31">F31</option>

           
        </select>
      
    </div>
  )
}

export default F_Input
