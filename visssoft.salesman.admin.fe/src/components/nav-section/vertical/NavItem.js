import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
// @mui
import {Box, Tooltip, Link, ListItemText} from '@mui/material';
// locales
import {useLocales} from '../../../locales';
// auth
import RoleBasedGuard from '../../../auth/RoleBasedGuard';
//
import Iconify from '../../iconify';
//
import {StyledItem, StyledIcon, StyledDotIcon} from './styles';
import SvgColor from "../../svg-color";
import {PATH_DASHBOARD} from "../../../routes/paths";

// ----------------------------------------------------------------------

NavItem.propTypes = {
  open: PropTypes.bool,
  active: PropTypes.bool,
  item: PropTypes.object,
  depth: PropTypes.number,
  isExternalLink: PropTypes.bool,
};

export default function NavItem({
  item,
  depth,
  open,
  active,
  isExternalLink,
  ...other
}) {
  const {translate} = useLocales();
  const iconI = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`}
                                    sx={{width: 1, height: 1}}/>;
  const {title, path, icon, info, children, disabled, caption, roles} = item;
  const subItem = depth !== 1;

  const renderContent = (
      <StyledItem depth={depth} active={active} disabled={disabled}
                  caption={!!caption} {...other}>
        {iconI(icon) && <StyledIcon>{iconI(icon)}</StyledIcon>}

        {subItem && (
            <StyledIcon>
              <StyledDotIcon active={active && subItem}/>
            </StyledIcon>
        )}

        <ListItemText
            primary={translate(title)}
            secondary={
                caption && (
                    <Tooltip title={translate(caption)} placement="top-start">
                      <span>{translate(caption)}</span>
                    </Tooltip>
                )
            }
            primaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: active ? 'subtitle2' : 'body2',
            }}
            secondaryTypographyProps={{
              noWrap: true,
              variant: 'caption',
            }}
        />

        {info && (
            <Box component="span" sx={{lineHeight: 0}}>
              {info}
            </Box>
        )}

        {(children?.length === 0) ? (<></>) : (
            <Iconify
                width={16}
                icon={open ? 'eva:arrow-ios-downward-fill'
                    : 'eva:arrow-ios-forward-fill'}
                sx={{ml: 1, flexShrink: 0}}
            />
        )}
      </StyledItem>
  );

  const renderItem = () => {
    // ExternalLink
    if (isExternalLink) {
      return (
          <Link href={PATH_DASHBOARD.root + path} target="_blank" rel="noopener"
                underline="none">
            {renderContent}
          </Link>
      );
    }

    // Has child
    if (children?.length !== 0) {
      return renderContent;
    }

    // Default
    return (
        <NextLink href={PATH_DASHBOARD.root + path} passHref>
          {renderContent}
        </NextLink>
    );
  };

  return <RoleBasedGuard roles={roles}> {renderItem()} </RoleBasedGuard>;
}
