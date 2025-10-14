import styled from '@emotion/styled';

export const Wrapper = styled.div<{ noMargin?: boolean }>`
  width: 100%;
  display: flex;
  gap: 10px;
  height: 100%;
  padding: 20px;
  flex-wrap: wrap;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-items: start;
`;
