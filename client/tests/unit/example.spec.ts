import HelloWorld from '@/components/HelloWorld.vue';
import { shallowMount } from '@vue/test-utils';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Play the ultimate game';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
      stubs: ['router-link'],
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
