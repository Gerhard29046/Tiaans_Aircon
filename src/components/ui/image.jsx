import * as React from "react"

/**
 * @typedef {React.ImgHTMLAttributes<HTMLImageElement> & {
 *   src?: string,
 *   fittingType?: "fill" | "fit",
 *   originWidth?: number,
 *   originHeight?: number,
 *   focalPointX?: number,
 *   focalPointY?: number,
 *   quality?: number,
 * }} ImageProps
 */

/**
 * Cloudflare-native image element. Public design images are served by Pages;
 * uploaded content is served through the application's R2-backed media API.
 *
 * @type {React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<HTMLImageElement>>}
 */
const Image = React.forwardRef(
  (
    {
      src,
      fittingType = "fill",
      originWidth,
      originHeight,
      focalPointX,
      focalPointY,
      quality: _quality,
      style,
      ...props
    },
    ref
  ) => {
    const objectPosition =
      typeof focalPointX === "number" || typeof focalPointY === "number"
        ? `${(focalPointX ?? 0.5) * 100}% ${(focalPointY ?? 0.5) * 100}%`
        : undefined

    return (
      <img
        ref={ref}
        src={src || undefined}
        loading="lazy"
        data-empty-image={!src || undefined}
        style={{
          objectFit: fittingType === "fit" ? "contain" : "cover",
          objectPosition,
          aspectRatio:
            originWidth && originHeight ? `${originWidth} / ${originHeight}` : undefined,
          ...style,
        }}
        {...props}
      />
    )
  }
)
Image.displayName = "Image"

export { Image }
