// commonUtils.js

import { parseISO, isValid } from 'date-fns';

export const commonUtils = {
    // 日付型チェック
    isValidateDate(dateString) {
        // 引数が8桁でない場合はエラーとする
        if (!this.isValidJustLength(dateString, 8)) return false;
        const parsedDate = parseISO(dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
        console.log(isValid(parsedDate));
        return isValid(parsedDate);
    },
    // 数値型チェック
    isValidNumber(value) {
        return typeof value === 'number';
    },
    // 数値の範囲チェック
    isValidRange(value, min, max) {
        return value >= min && value <= max;
    },
    // 桁数チェック
    isValidMaxLength(value, maxLength) {
        return value.length <= maxLength;
    },
    // 桁数チェック
    isValidJustLength(value, length) {
        return value.length == length;
    },
    // 有効日付のチェック
    isCheckDateTime(targetDate) {
        // 日時の正規表現パターン
        const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        // 入力された日時がパターンに一致するかどうかを確認
        if (!dateTimePattern.test(targetDate)) {
            return false; // パターンに一致しない場合は無効な日時
        }
        // 日付の妥当性を検証
        const inputDate = new Date(targetDate);
        return !isNaN(inputDate.getTime()); // インスタンスが有効な日時であるかどうか
    },
    // 日付の差のチェック
    isDateDifferenceDays(targerDate1, targetDate2) {
        const differenceInMilliseconds = Math.abs(targerDate1 - targetDate2);
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

        return differenceInDays;
    },
};
