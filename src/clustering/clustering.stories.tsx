import { Meta, StoryObj } from "storybook-framework-qwik/*";
import Cluster,  { type ClusterProps } from "./cluster";
import { cluster as clustering } from "./clustering";

const meta: Meta<ClusterProps> = {
  component: Cluster,
  argTypes: {},
};

type Story = StoryObj<ClusterProps>;

export default meta;


const twoEndsDataSet = clustering([{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }], 1, 1);

export const TwoEnds: Story = {
    args: {
        dataset: twoEndsDataSet,
        width: 100,
        height: 100,
        size: 5,
    }
}