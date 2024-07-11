export default class Router {
    private GetRoot;



    // Insert new GET Path handler
    Get(path: string, handler: Function): void {
        // TODO: Base "/" endpoint case
        // Remove leading and trailing slashes
        if (path[0] === "/") {
            path = path.slice(1);
        }
        if (path[path.length-1] === "/") {
            path = path.slice(0, -1);
        }
        
        let segments: string[] = path.split("/");

        if (this.GetRoot === undefined) {
           this.GetRoot = new RouterNode({ path: segments[0], handler });
           segments.shift();
        }

        let curr = this.GetRoot;
        let parent = curr;

        while (segments.length) {
            const pathSegment = segments.shift()
            if (!curr || curr.path !== pathSegment) {
                // Only add handler if it's the end of the path
                if (segments.length) {
                    parent = parent.insert(pathSegment, undefined);
                    
                } else {
                    parent = parent.insert(pathSegment, handler);
                }
                curr = null;
            } else {
                parent = curr;
                curr = this.getChild(curr, segments[0]);
            }
        }
    }

    getChild(node: RouterNode, path: string): RouterNode|null {
        if (node.children?.length) {
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].path === path) {
                    return node.children[i];
                }
            }
        }
        return null;
    }

}

class RouterNode {
    path: string;
    handler?: Function;
    children?: RouterNode[];

    constructor({ path, handler }: { path: string, handler: Function}) {
        this.path = path;
        this.handler = handler;
    }

    insert(path: string, handler: Function): RouterNode {
        if (this.children === undefined) {
            this.children = [];
        }
        const node = new RouterNode({ path, handler });
        this.children.push(node);
        return node;
    }
}