import React, { type ComponentPropsWithoutRef } from 'react';

import { createPayee } from 'loot-core/client/actions';

import { useAccounts } from '../../hooks/useAccounts';
import { usePayees } from '../../hooks/usePayees';
import { SvgAdd } from '../../icons/v1';
import { useResponsive } from '../../ResponsiveProvider';
import { styles, theme } from '../../style';
import { ItemHeader } from '../autocomplete/ItemHeader';
import {
  PayeeAutocomplete,
  PayeeItem,
  CreatePayeeButton,
} from '../autocomplete/PayeeAutocomplete';
import { Modal } from '../common/Modal';
import { type CommonModalProps } from '../Modals';

type PayeeAutocompleteModalProps = {
  modalProps: CommonModalProps;
  autocompleteProps?: ComponentPropsWithoutRef<typeof PayeeAutocomplete>;
  onClose: () => void;
};

export function PayeeAutocompleteModal({
  modalProps,
  autocompleteProps,
  onClose,
}: PayeeAutocompleteModalProps) {
  const payees = usePayees() || [];
  const accounts = useAccounts() || [];

  const { onSelect, ...restAutocompleteProps } = autocompleteProps;

  const _onClose = () => {
    modalProps.onClose();
    onClose?.();
  };

  const _onSelect = payeeId => {
    onSelect?.(payeeId);
    _onClose();
  };

  const itemStyle = {
    ...styles.mobileMenuItem,
  };

  const { isNarrowWidth } = useResponsive();
  const inputStyle = {
    ':focus': { boxShadow: 0 },
    ...(isNarrowWidth && itemStyle),
  };
  const defaultAutocompleteProps = {
    inputProps: { style: inputStyle },
    containerProps: { style: { height: isNarrowWidth ? '90vh' : 275 } },
  };

  return (
    <Modal
      title="Payee"
      noAnimation={!isNarrowWidth}
      showHeader={isNarrowWidth}
      focusAfterClose={false}
      {...modalProps}
      onClose={_onClose}
      padding={0}
      style={{
        flex: 0,
        height: isNarrowWidth ? '85vh' : 275,
        padding: '15px 10px',
        borderRadius: '6px',
        ...(!isNarrowWidth && {
          backgroundColor: theme.mobileModalBackground,
          color: theme.mobileModalText,
        }),
      }}
    >
      {() => (
        <PayeeAutocomplete
          payees={payees}
          accounts={accounts}
          value={null}
          focused={true}
          embedded={true}
          closeOnBlur={false}
          showManagePayees={false}
          showMakeTransfer={!isNarrowWidth}
          onSelect={async value => {
            if (value && value.startsWith('new:')) {
              value = await createPayee(value.slice('new:'.length));
            }

            _onSelect?.(value);
          }}
          {...(isNarrowWidth && {
            renderCreatePayeeButton: props => (
              <CreatePayeeButton
                {...props}
                Icon={CreatePayeeIcon}
                style={itemStyle}
              />
            ),
            renderPayeeItemGroupHeader: props => (
              <ItemHeader
                {...props}
                style={{
                  ...styles.largeText,
                  color: theme.menuItemTextHeader,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              />
            ),
            renderPayeeItem: props => (
              <PayeeItem
                {...props}
                style={{
                  ...itemStyle,
                  color: theme.menuItemText,
                  borderRadius: 0,
                  borderTop: `1px solid ${theme.pillBorder}`,
                }}
              />
            ),
          })}
          {...defaultAutocompleteProps}
          {...restAutocompleteProps}
        />
      )}
    </Modal>
  );
}

function CreatePayeeIcon(props) {
  return <SvgAdd {...props} width={14} height={14} />;
}
