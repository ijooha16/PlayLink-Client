import React, { MouseEvent, useState } from 'react';
import styled from '@emotion/styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

interface StyledProps {
  borderColor?: string;
  headerColor?: string;
  selectedColor?: string;
  focusBorderColor?: string;
  inputWidth?: string;
  inputBgColor?: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<StyledProps>`
  user-select: none;
  background-color: white;
  border-radius: 10px;

  .react-datepicker {
    border: none;
    border-radius: 10px;
  }

  .react-datepicker__header {
    background-color: ${(props) => props.headerColor || '#007bff'};
    color: white;
    border-bottom: none;
    border-radius: 10px;
    padding: 20px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .react-datepicker__current-month {
    text-align: center;
    font-size: 1.2rem;
    margin: 0;
  }

  .react-datepicker__navigation {
    margin-top: 12px;
  }

  .react-datepicker__day {
    color: #333;
  }

  .react-datepicker__day:hover {
    background-color: #0056b3;
    color: white;
  }

  .react-datepicker__day--selected {
    background-color: ${(props) => props.selectedColor || '#0056b3'};
    color: white;
  }

  .react-datepicker__day--disabled {
    color: #ccc;
    cursor: not-allowed;
    border-radius: 25%;
  }

  .react-datepicker__day--outside-month {
    color: white;
  }
`;

const DateInput = styled.input<{ borderColor?: string; inputBgColor?: string }>`
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${(props) => props.borderColor || '#d1d5db'};
  background-color: ${(props) => props.inputBgColor || 'white'};
  padding: 8px 16px;
  font-size: 16px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${(props) => props.borderColor || '#007bff'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CancelButton = styled.button`
  border: none;
  background: none;
  color: #6b7280;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: 8px 16px;
`;

interface DatePickerModalProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  borderColor?: string;
  headerColor?: string;
  selectedColor?: string;
  focusBorderColor?: string;
  inputWidth?: string;
  inputBgColor?: string;
  minDate?: Date;
  dateFormat?: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  selectedDate,
  onChange,
  placeholder = '날짜를 선택하세요',
  borderColor = '#d1d5db',
  headerColor = '#ffffff',
  selectedColor = '#0056b3',
  inputBgColor = 'white',
  minDate = new Date(),
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (date: Date | null) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div>
      <DateInput
        value={selectedDate ? selectedDate.toLocaleDateString('ko-KR') : ''}
        onClick={handleInputClick}
        readOnly
        placeholder={placeholder}
        borderColor={borderColor}
        inputBgColor={inputBgColor}
      />
      {isOpen && (
        <ModalOverlay onClick={handleClose}>
          <ModalContent
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            borderColor={borderColor}
            headerColor={headerColor}
            selectedColor={selectedColor}
          >
            <DatePicker
              selected={selectedDate}
              onChange={handleChange}
              inline
              locale={ko}
              minDate={minDate}
              disabledKeyboardNavigation={true}
              {...props}
            />
            <ButtonContainer>
              <CancelButton type='button' onClick={() => setIsOpen(false)}>
                취소
              </CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default DatePickerModal;