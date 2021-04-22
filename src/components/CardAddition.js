import React, { useState, useEffect, useRef } from "react";
import Card from "../stories/Card";
import { CARD, CARD_SIZE } from "../stories/constants/card";
import Input from "../stories/Input";

const splitCardNumbers = (value) => {
  const splitNumbers = [];
  let i;

  for (i = 0; i < value.length / 4; i++) {
    splitNumbers.push(value.slice(i * 4, (i + 1) * 4));
  }
  if (value[i * 4] !== undefined) {
    splitNumbers.push(value.slice(i * 4, (i + 1) * 4));
  }

  return splitNumbers;
};

const formatCardNumbers = (numbers) => {
  const hiddenNumbers = numbers
    .slice(2)
    .map((value) => "•".repeat(value.length));

  return [...numbers.slice(0, 2), ...hiddenNumbers].join(" - ");
};

const unformatCardNumbers = (formattedValue) => {
  return formattedValue.replace(/[\s-]/g, "");
};

const isNonNumberValue = (value) => {
  return /[^0-9]/g.test(value);
};

function CardAddition(props) {
  const [cardType, setCardType] = useState(CARD.UNKNOWN);
  const [cardNumbers, setCardNumbers] = useState([]);
  const [selectionStart, setSelectionStart] = useState(0);

  const cardNumbersInputRef = useRef();

  useEffect(() => {
    cardNumbersInputRef?.current?.setSelectionRange(
      selectionStart,
      selectionStart
    );
  }, [cardNumbers, selectionStart]);

  const onCardNumbersChange = (event) => {
    const { value, selectionStart } = event.target;
    const joinedCardNumbers = cardNumbers.join(" - ");
    const diff = value.length - joinedCardNumbers.length;
    let updatedCardNumbers = joinedCardNumbers;

    const mod = selectionStart % 7;
    if (mod === 0 || mod === 6 || mod === 5) {
      setSelectionStart(selectionStart + ((8 - mod) % 7));
    } else {
      setSelectionStart(selectionStart);
    }

    switch (true) {
      case diff > 0:
        if (isNonNumberValue(value[selectionStart - 1])) {
          return;
        }

        updatedCardNumbers =
          joinedCardNumbers.slice(0, selectionStart - 1) +
          value[selectionStart - 1] +
          joinedCardNumbers.slice(selectionStart - 1);
        break;
      case diff === 0:
        if (isNonNumberValue(value[selectionStart - 1])) {
          return;
        }

        updatedCardNumbers =
          joinedCardNumbers.slice(0, selectionStart - 1) +
          value[selectionStart - 1] +
          joinedCardNumbers.slice(selectionStart);
        break;
      case diff < 0:
        updatedCardNumbers =
          joinedCardNumbers.slice(0, selectionStart) +
          joinedCardNumbers.slice(selectionStart + 1);
        break;
      default:
    }

    const unformattedValue = unformatCardNumbers(updatedCardNumbers);
    const splitNumbers = splitCardNumbers(unformattedValue);

    setCardNumbers(splitNumbers);
  };

  return (
    <>
      <div className="card-addition">
        <Card cardType={cardType} size={CARD_SIZE.MEDIUM} />
        <form className="card-addition__form">
          <div className="card-addition__number-input mt-standard">
            <label htmlFor="card-number">카드 번호</label>
            <Input
              id="card-number"
              type="text"
              isCenter={true}
              value={formatCardNumbers(cardNumbers)}
              onChange={onCardNumbersChange}
              option={{
                ref: cardNumbersInputRef,
                maxlength: "25",
              }}
            />
          </div>

          <div className="card-addition__expiration-input mt-standard">
            <label htmlFor="expiration-date">만료일</label>
            <Input
              id="expiration-date"
              type="text"
              isCenter={true}
              placeHolder="MM / YY"
            />
          </div>

          <div className="card-addition__username-input mt-standard">
            <label htmlFor="username">카드 소유자 이름(선택)</label>
            <span className="card-addition__username-indicator">0/30</span>
            <Input
              id="username"
              type="text"
              isCenter={true}
              placeHolder="카드에 표시된 이름과 동일하게 입력하세요"
            />
          </div>

          <div className="card-addition__cvc mt-standard">
            <label htmlFor="cvc">보안 코드(CVC/CVV)</label>
            <div className="card-addition__cvc-inner">
              <Input id="cvc" type="number" isCenter={true} />
              <div className="card-addition__tool-tip-button">
                <span>?</span>
              </div>
            </div>
          </div>

          <div className="card-addition__password mt-standard">
            <label>카드비밀번호</label>
            <div className="card-addition__password-inner">
              <Input
                type="number"
                isCenter={true}
                option={{
                  "aria-label": "첫번째 비밀번호",
                  min: 0,
                  max: 9,
                  maxlength: 1,
                  required: "required",
                }}
              />
              <Input
                type="number"
                isCenter={true}
                option={{
                  "aria-label": "두번째 비밀번호",
                  min: 0,
                  max: 9,
                  maxlength: 1,
                  required: "required",
                }}
              />
              <div className="card-addition__dot-wrapper">
                <span className="card-addition__dot"></span>
              </div>
              <div className="card-addition__dot-wrapper">
                <span className="card-addition__dot"></span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default CardAddition;
