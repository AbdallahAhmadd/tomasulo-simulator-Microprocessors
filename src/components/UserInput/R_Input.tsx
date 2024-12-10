
import React from 'react';

interface R_InputProps {
  label: string;
  value: string; // Current selected value in the dropdown
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const R_Input: React.FC<R_InputProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label>Register (R{label}):</label>
      <select value={value} onChange={onChange}>
      <option value="" disabled selected>Select a register</option>
      <option value="R0">R0</option>
      <option value="R1">R1</option>
      <option value="R2">R2</option>
      <option value="R3">R3</option>
      <option value="R4">R4</option>
      <option value="R5">R5</option>
      <option value="R6">R6</option>
      <option value="R7">R7</option>
      <option value="R8">R8</option>
      <option value="R9">R9</option>
      <option value="R10">R10</option>
      <option value="R11">R11</option>
      <option value="R12">R12</option>
      <option value="R13">R13</option>
      <option value="R14">R14</option>
      <option value="R15">R15</option>
      <option value="R16">R16</option>
      <option value="R17">R17</option>
      <option value="R18">R18</option>
      <option value="R19">R19</option>
      <option value="R20">R20</option>
      <option value="R21">R21</option>
      <option value="R22">R22</option>
      <option value="R23">R23</option>
      <option value="R24">R24</option>
      <option value="R25">R25</option>
      <option value="R26">R26</option>
      <option value="R27">R27</option>
      <option value="R28">R28</option>
      <option value="R29">R29</option>
      <option value="R30">R30</option>
      <option value="R31">R31</option>
        
      </select>
    </div>
  )
}

export default R_Input
