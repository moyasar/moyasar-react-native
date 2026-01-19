import { render } from '@testing-library/react-native';
import { MoyasarLogo } from '../../../views/credit_card/components/moyasar_logo';

describe('MoyasarLogo', () => {
  it('renders PoweredByLogo', () => {
    const { UNSAFE_getByType } = render(<MoyasarLogo isPortrait={true} />);

    expect(() =>
      UNSAFE_getByType(require('../../../assets/powered_logo').PoweredByLogo)
    ).not.toThrow();
  });

  it('applies 50% width when isPortrait is true', () => {
    const { UNSAFE_getAllByType } = render(<MoyasarLogo isPortrait={true} />);

    const views = UNSAFE_getAllByType(require('react-native').View);
    const logoView = views.find((view) =>
      view.props.style?.some((style: any) => style?.width === '50%')
    );
    expect(logoView).toBeTruthy();
  });

  it('applies 30% width when isPortrait is false', () => {
    const { UNSAFE_getAllByType } = render(<MoyasarLogo isPortrait={false} />);

    const views = UNSAFE_getAllByType(require('react-native').View);
    const logoView = views.find((view) =>
      view.props.style?.some((style: any) => style?.width === '30%')
    );
    expect(logoView).toBeTruthy();
  });

  it('changes width responsively based on orientation', () => {
    const { UNSAFE_getAllByType, rerender } = render(
      <MoyasarLogo isPortrait={true} />
    );

    let views = UNSAFE_getAllByType(require('react-native').View);
    let logoView = views.find((view) =>
      view.props.style?.some((style: any) => style?.width === '50%')
    );
    expect(logoView).toBeTruthy();

    // Change orientation
    rerender(<MoyasarLogo isPortrait={false} />);

    views = UNSAFE_getAllByType(require('react-native').View);
    logoView = views.find((view) =>
      view.props.style?.some((style: any) => style?.width === '30%')
    );
    expect(logoView).toBeTruthy();
  });
});
